#!/usr/bin/env node

import { execFile, spawn } from "node:child_process";
import { access, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { gzip } from "node:zlib";
import { promisify } from "node:util";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { launch as launchChrome } from "chrome-launcher";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

const execFileAsync = promisify(execFile);
const gzipAsync = promisify(gzip);

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const nextDirectory = path.join(projectRoot, ".next");
const publicDirectory = path.join(projectRoot, "public");
const reportsDirectory = path.join(projectRoot, "reports");
const lighthouseJsonPath = path.join(reportsDirectory, "lighthouse.json");
const lighthouseHtmlPath = path.join(reportsDirectory, "lighthouse.html");
const auditJsonPath = path.join(reportsDirectory, "deep-performance-audit.json");
const serverLogPath = path.join(reportsDirectory, "performance-server.log");
const baseUrl = process.env.PERF_AUDIT_URL ?? "http://localhost:3000";
const port = Number(new URL(baseUrl).port || 3000);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const severityWeight = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
const productionSearchTerms = [
  "framer-motion",
  "motion",
  "use client",
  "hero.webp",
  "quality",
  "backdrop-blur",
  "blur-",
  "background-position",
];
const colorEnabled = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
const colors = {
  reset: colorEnabled ? "\u001b[0m" : "",
  bold: colorEnabled ? "\u001b[1m" : "",
  dim: colorEnabled ? "\u001b[2m" : "",
  red: colorEnabled ? "\u001b[31m" : "",
  yellow: colorEnabled ? "\u001b[33m" : "",
  green: colorEnabled ? "\u001b[32m" : "",
  cyan: colorEnabled ? "\u001b[36m" : "",
};

let serverProcess;
let serverLog = "";
let interrupted = false;

function paint(value, color) {
  return `${colors[color] ?? ""}${value}${colors.reset}`;
}

function heading(title) {
  console.log(`\n${paint(`=== ${title} ===`, "bold")}`);
}

function phase(message) {
  console.log(`\n${paint("▶", "cyan")} ${paint(message, "bold")}`);
}

function formatBytes(bytes = 0) {
  if (!Number.isFinite(bytes)) return "n/a";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MiB`;
}

function formatMilliseconds(value) {
  if (!Number.isFinite(value)) return "n/a";
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${Math.round(value)} ms`;
}

function formatMetric(audit, kind = "time") {
  if (!audit) return "not available";
  if (audit.displayValue) return audit.displayValue;
  if (kind === "score") return `${Math.round((audit.numericValue ?? 0) * 100)}`;
  if (kind === "unitless") return Number(audit.numericValue ?? 0).toFixed(3);
  return formatMilliseconds(audit.numericValue);
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split("\n").length;
}

async function pathExists(candidate) {
  try {
    await access(candidate, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function runCommand(label, command, args, options = {}) {
  phase(label);
  const startedAt = Date.now();
  let output = "";

  const child = spawn(command, args, {
    cwd: projectRoot,
    env: { ...process.env, ...options.env },
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  const writeChunk = (stream, chunk) => {
    const text = chunk.toString();
    output += text;
    stream.write(text);
  };

  child.stdout.on("data", (chunk) => writeChunk(process.stdout, chunk));
  child.stderr.on("data", (chunk) => writeChunk(process.stderr, chunk));

  const result = await new Promise((resolve) => {
    child.once("error", (error) => {
      output += `\n${error.stack ?? error.message}\n`;
      resolve({ code: 1, signal: null, error });
    });
    child.once("close", (code, signal) => resolve({ code: code ?? 1, signal }));
  });

  const durationMs = Date.now() - startedAt;
  const succeeded = result.code === 0;
  console.log(
    `${succeeded ? paint("✓", "green") : paint("✗", "red")} ${label} ${
      succeeded ? "passed" : `failed with exit code ${result.code}`
    } (${formatMilliseconds(durationMs)})`,
  );

  return { ...result, label, command, args, durationMs, output, succeeded };
}

async function listListeningPids(targetPort) {
  if (process.platform === "win32") {
    const command =
      `Get-NetTCPConnection -LocalPort ${targetPort} -State Listen -ErrorAction SilentlyContinue | ` +
      "Select-Object -ExpandProperty OwningProcess -Unique";
    try {
      const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-Command", command]);
      return [
        ...new Set(
          stdout
            .split(/\s+/)
            .map(Number)
            .filter((pid) => Number.isInteger(pid) && pid > 0),
        ),
      ];
    } catch {
      return [];
    }
  }

  try {
    const { stdout } = await execFileAsync("lsof", [
      "-nP",
      `-iTCP:${targetPort}`,
      "-sTCP:LISTEN",
      "-t",
    ]);
    return [
      ...new Set(
        stdout
          .split(/\s+/)
          .map(Number)
          .filter((pid) => Number.isInteger(pid) && pid > 0),
      ),
    ];
  } catch (error) {
    if (error.code === 1) return [];
    throw error;
  }
}

async function pidIsAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitForPidsToExit(pids, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const alive = [];
    for (const pid of pids) {
      if (await pidIsAlive(pid)) alive.push(pid);
    }
    if (alive.length === 0) return [];
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const alive = [];
  for (const pid of pids) {
    if (await pidIsAlive(pid)) alive.push(pid);
  }
  return alive;
}

async function killPort(targetPort) {
  phase(`Killing any process listening on port ${targetPort}`);
  const pids = await listListeningPids(targetPort);
  if (pids.length === 0) {
    console.log(`${paint("✓", "green")} Port ${targetPort} is already free`);
    return [];
  }

  console.log(`Found listener PID${pids.length === 1 ? "" : "s"}: ${pids.join(", ")}`);
  if (process.platform === "win32") {
    for (const pid of pids) {
      await execFileAsync("taskkill.exe", ["/PID", String(pid), "/T", "/F"]).catch(() => {});
    }
  } else {
    for (const pid of pids) {
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        // The process may already have exited.
      }
    }
    const stubbornPids = await waitForPidsToExit(pids, 4_000);
    for (const pid of stubbornPids) {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // The process may already have exited.
      }
    }
  }

  const remaining = await listListeningPids(targetPort);
  if (remaining.length > 0) {
    throw new Error(`Unable to free port ${targetPort}; remaining PIDs: ${remaining.join(", ")}`);
  }
  console.log(`${paint("✓", "green")} Port ${targetPort} is free`);
  return pids;
}

async function removeNextBuild() {
  phase("Removing .next");
  await rm(nextDirectory, { recursive: true, force: true });
  console.log(`${paint("✓", "green")} Removed ${path.relative(projectRoot, nextDirectory)}`);
}

function startProductionServer() {
  phase(`Starting production server on port ${port}`);
  serverLog = "";
  serverProcess = spawn(npmCommand, ["run", "start", "--", "-p", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
    shell: false,
  });

  const handleOutput = (stream, chunk) => {
    const text = chunk.toString();
    serverLog += text;
    stream.write(text);
  };
  serverProcess.stdout.on("data", (chunk) => handleOutput(process.stdout, chunk));
  serverProcess.stderr.on("data", (chunk) => handleOutput(process.stderr, chunk));
  serverProcess.once("error", (error) => {
    serverLog += `\n${error.stack ?? error.message}\n`;
  });

  console.log(`Server process started with PID ${serverProcess.pid}`);
  return serverProcess;
}

async function stopProductionServer() {
  if (!serverProcess || serverProcess.exitCode !== null) return;

  phase("Stopping production server");
  try {
    if (process.platform === "win32") {
      await execFileAsync("taskkill.exe", ["/PID", String(serverProcess.pid), "/T", "/F"]).catch(
        () => {},
      );
    } else {
      process.kill(-serverProcess.pid, "SIGTERM");
      await Promise.race([
        new Promise((resolve) => serverProcess.once("close", resolve)),
        new Promise((resolve) => setTimeout(resolve, 4_000)),
      ]);
      if (serverProcess.exitCode === null) process.kill(-serverProcess.pid, "SIGKILL");
    }
  } catch {
    // A process can exit between the state check and the signal.
  }

  serverProcess = undefined;
  console.log(`${paint("✓", "green")} Production server stopped`);
}

async function waitForSite(url, timeoutMs = 120_000) {
  phase(`Waiting for ${url}`);
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    if (serverProcess?.exitCode !== null) {
      throw new Error(`Production server exited early with code ${serverProcess.exitCode}`);
    }

    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
      });
      if (response.status > 0 && response.status < 500) {
        console.log(`${paint("✓", "green")} Site responded with HTTP ${response.status}`);
        return response.status;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  throw new Error(
    `Timed out after ${formatMilliseconds(timeoutMs)} waiting for ${url}: ${
      lastError?.message ?? "unknown error"
    }`,
  );
}

async function findChromiumExecutable() {
  const configured = [process.env.CHROME_PATH, process.env.CHROMIUM_PATH].filter(Boolean);
  const platformCandidates =
    process.platform === "darwin"
      ? [
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
          "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
          "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
        ]
      : process.platform === "win32"
        ? [
            `${process.env.PROGRAMFILES ?? ""}\\Google\\Chrome\\Application\\chrome.exe`,
            `${process.env["PROGRAMFILES(X86)"] ?? ""}\\Google\\Chrome\\Application\\chrome.exe`,
            `${process.env.LOCALAPPDATA ?? ""}\\Google\\Chrome\\Application\\chrome.exe`,
            `${process.env.PROGRAMFILES ?? ""}\\Microsoft\\Edge\\Application\\msedge.exe`,
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/usr/bin/microsoft-edge",
          ];

  for (const candidate of [...configured, ...platformCandidates]) {
    if (candidate && (await pathExists(candidate))) return candidate;
  }
  return null;
}

async function collectBrowserFindings(url, executablePath) {
  phase("Opening the production site with Playwright/Chromium");

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const imageErrors = [];
  const responses = [];
  const browser = await chromium.launch({
    headless: true,
    executablePath: executablePath ?? undefined,
    args: ["--disable-dev-shm-usage"],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const location = message.location();
      const finding = {
        type: "console",
        text: message.text(),
        url: location.url || null,
        lineNumber: location.lineNumber ?? null,
        columnNumber: location.columnNumber ?? null,
      };
      consoleErrors.push(finding);
      if (/image|_next\/image|quality|optimizer|upstream/i.test(finding.text)) {
        imageErrors.push(finding);
      }
    });

    page.on("pageerror", (error) => {
      const finding = { type: "pageerror", text: error.message, stack: error.stack ?? null };
      pageErrors.push(finding);
      if (/image|_next\/image|quality|optimizer|upstream/i.test(finding.text)) {
        imageErrors.push(finding);
      }
    });

    page.on("requestfailed", (request) => {
      const finding = {
        type: "requestfailed",
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        errorText: request.failure()?.errorText ?? "unknown network error",
      };
      failedRequests.push(finding);
      if (finding.resourceType === "image" || /\/_next\/image|hero\.webp/i.test(finding.url)) {
        imageErrors.push(finding);
      }
    });

    page.on("response", (response) => {
      const request = response.request();
      const record = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        method: request.method(),
        resourceType: request.resourceType(),
      };
      responses.push(record);
      if (record.status >= 400) failedRequests.push({ type: "response", ...record });
      if (
        (record.resourceType === "image" || /\/_next\/image|hero\.webp/i.test(record.url)) &&
        record.status >= 400
      ) {
        imageErrors.push({ type: "image-response", ...record });
      }
    });

    let navigationError = null;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
    } catch (error) {
      navigationError = error.message;
      console.error(`${paint("!", "yellow")} Navigation did not reach network idle: ${error.message}`);
    }

    await page
      .evaluate(async () => {
        const delay = (milliseconds) =>
          new Promise((resolve) => window.setTimeout(resolve, milliseconds));
        const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        for (let y = 0; y < maxScroll; y += Math.max(window.innerHeight * 0.8, 500)) {
          window.scrollTo({ top: y, behavior: "instant" });
          await delay(125);
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        await delay(1_000);
      })
      .catch(() => {});

    const documentSummary = await page
      .evaluate(() => ({
        title: document.title,
        readyState: document.readyState,
        images: [...document.images].map((image) => ({
          src: image.currentSrc || image.src,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          loading: image.loading,
        })),
        resources: performance.getEntriesByType("resource").map((entry) => ({
          name: entry.name,
          initiatorType: entry.initiatorType,
          duration: entry.duration,
          transferSize: entry.transferSize,
          decodedBodySize: entry.decodedBodySize,
        })),
      }))
      .catch(() => ({ title: null, readyState: null, images: [], resources: [] }));

    for (const image of documentSummary.images) {
      if (image.complete && image.naturalWidth === 0) {
        imageErrors.push({
          type: "broken-dom-image",
          url: image.src,
          text: "Image completed with naturalWidth=0",
        });
      }
    }

    console.log(
      `${paint("✓", "green")} Browser pass complete: ${consoleErrors.length} console error(s), ` +
        `${pageErrors.length} runtime error(s), ${failedRequests.length} failed resource(s), ` +
        `${imageErrors.length} image error(s)`,
    );

    return {
      consoleErrors,
      pageErrors,
      failedRequests,
      imageErrors,
      navigationError,
      responseCount: responses.length,
      documentSummary,
    };
  } finally {
    await browser.close();
  }
}

function selectLighthouseReport(report, format) {
  const reports = Array.isArray(report) ? report : [report];
  if (format === "html") {
    return reports.find((item) => typeof item === "string" && /<!doctype html|<html/i.test(item));
  }
  return reports.find(
    (item) => typeof item === "string" && item.trimStart().startsWith("{"),
  );
}

async function runLighthouseAudit(url, executablePath) {
  phase("Running Lighthouse mobile performance audit");

  const chrome = await launchChrome({
    chromePath: executablePath ?? undefined,
    chromeFlags: [
      "--headless=new",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
    ],
    logLevel: "silent",
  });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: ["json", "html"],
      logLevel: "info",
      onlyCategories: ["performance"],
      formFactor: "mobile",
      throttlingMethod: "simulate",
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        disabled: false,
      },
    });

    if (!result?.lhr) throw new Error("Lighthouse did not return an LHR result");

    const htmlReport = selectLighthouseReport(result.report, "html");
    if (!htmlReport) throw new Error("Lighthouse did not generate an HTML report");

    await writeFile(lighthouseJsonPath, `${JSON.stringify(result.lhr, null, 2)}\n`, "utf8");
    await writeFile(lighthouseHtmlPath, htmlReport, "utf8");
    console.log(`${paint("✓", "green")} Saved ${path.relative(projectRoot, lighthouseJsonPath)}`);
    console.log(`${paint("✓", "green")} Saved ${path.relative(projectRoot, lighthouseHtmlPath)}`);
    return result.lhr;
  } finally {
    await chrome.kill();
  }
}

function extractMetrics(lhr) {
  const audits = lhr.audits ?? {};
  const inpId = [
    "interaction-to-next-paint",
    "experimental-interaction-to-next-paint",
  ].find((id) => audits[id]);

  return {
    warnings: lhr.runWarnings ?? [],
    runtimeError: lhr.runtimeError ?? null,
    performanceScore:
      typeof lhr.categories?.performance?.score === "number"
        ? Math.round(lhr.categories.performance.score * 100)
        : null,
    fcp: {
      id: "first-contentful-paint",
      numericValue: audits["first-contentful-paint"]?.numericValue ?? null,
      displayValue: formatMetric(audits["first-contentful-paint"]),
    },
    lcp: {
      id: "largest-contentful-paint",
      numericValue: audits["largest-contentful-paint"]?.numericValue ?? null,
      displayValue: formatMetric(audits["largest-contentful-paint"]),
    },
    tbt: {
      id: "total-blocking-time",
      numericValue: audits["total-blocking-time"]?.numericValue ?? null,
      displayValue: formatMetric(audits["total-blocking-time"]),
    },
    cls: {
      id: "cumulative-layout-shift",
      numericValue: audits["cumulative-layout-shift"]?.numericValue ?? null,
      displayValue: formatMetric(audits["cumulative-layout-shift"], "unitless"),
    },
    inp: inpId
      ? {
          id: inpId,
          numericValue: audits[inpId]?.numericValue ?? null,
          displayValue: formatMetric(audits[inpId]),
        }
      : null,
    speedIndex: {
      id: "speed-index",
      numericValue: audits["speed-index"]?.numericValue ?? null,
      displayValue: formatMetric(audits["speed-index"]),
    },
  };
}

function detailItems(audit) {
  const details = audit?.details;
  if (!details) return [];
  if (Array.isArray(details.items)) return details.items;
  return [];
}

function firstAvailableAudit(audits, ids) {
  for (const id of ids) {
    if (audits[id]) return { id, audit: audits[id] };
  }
  return { id: ids[0], audit: null };
}

function compactAudit(id, audit, limit = 30) {
  if (!audit) return { id, available: false, items: [] };
  return {
    id,
    available: true,
    title: audit.title,
    score: audit.score,
    scoreDisplayMode: audit.scoreDisplayMode,
    numericValue: audit.numericValue ?? null,
    numericUnit: audit.numericUnit ?? null,
    displayValue: audit.displayValue ?? null,
    description: audit.description ?? null,
    warnings: audit.warnings ?? [],
    items: detailItems(audit).slice(0, limit),
  };
}

function extractDiagnostics(lhr) {
  const audits = lhr.audits ?? {};
  const longTasks = firstAvailableAudit(audits, ["long-tasks"]);
  const mainThread = firstAvailableAudit(audits, ["mainthread-work-breakdown"]);
  const unusedJavaScript = firstAvailableAudit(audits, ["unused-javascript"]);
  const renderBlocking = firstAvailableAudit(audits, [
    "render-blocking-insight",
    "render-blocking-resources",
  ]);
  const nonCompositedAnimations = firstAvailableAudit(audits, ["non-composited-animations"]);

  const imageAuditIds = [
    "image-delivery-insight",
    "uses-optimized-images",
    "uses-responsive-images",
    "modern-image-formats",
    "efficient-animated-content",
    "offscreen-images",
  ];

  return {
    longTasks: compactAudit(longTasks.id, longTasks.audit, 50),
    mainThreadWork: compactAudit(mainThread.id, mainThread.audit, 50),
    unusedJavaScript: compactAudit(unusedJavaScript.id, unusedJavaScript.audit, 50),
    renderBlockingRequests: compactAudit(renderBlocking.id, renderBlocking.audit, 50),
    imageDeliveryIssues: imageAuditIds
      .filter((id) => audits[id])
      .map((id) => compactAudit(id, audits[id], 50)),
    nonCompositedAnimations: compactAudit(
      nonCompositedAnimations.id,
      nonCompositedAnimations.audit,
      50,
    ),
  };
}

async function walkFiles(directory, predicate) {
  if (!(await pathExists(directory))) return [];
  const output = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await walkFiles(absolutePath, predicate)));
    else if (entry.isFile() && predicate(absolutePath)) output.push(absolutePath);
  }
  return output;
}

async function loadChunkRouteMap() {
  const routeMap = new Map();
  const manifestPaths = [
    path.join(nextDirectory, "app-build-manifest.json"),
    path.join(nextDirectory, "build-manifest.json"),
  ];

  const addRoute = (file, route) => {
    const normalized = file.replace(/^\/+/, "");
    if (!routeMap.has(normalized)) routeMap.set(normalized, new Set());
    routeMap.get(normalized).add(route);
  };

  for (const manifestPath of manifestPaths) {
    if (!(await pathExists(manifestPath))) continue;
    try {
      const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
      const pages = manifest.pages ?? manifest;
      for (const [route, files] of Object.entries(pages)) {
        if (!Array.isArray(files)) continue;
        for (const file of files) {
          if (typeof file === "string" && file.endsWith(".js")) addRoute(file, route);
        }
      }
      for (const file of [...(manifest.rootMainFiles ?? []), ...(manifest.polyfillFiles ?? [])]) {
        if (typeof file === "string" && file.endsWith(".js")) addRoute(file, "shared runtime");
      }
    } catch (error) {
      console.error(`${paint("!", "yellow")} Could not parse ${manifestPath}: ${error.message}`);
    }
  }

  const appHtmlFiles = await walkFiles(path.join(nextDirectory, "server", "app"), (file) =>
    file.endsWith(".html"),
  );
  for (const htmlPath of appHtmlFiles) {
    const relative = path.relative(path.join(nextDirectory, "server", "app"), htmlPath);
    const route =
      relative === "index.html"
        ? "/"
        : `/${relative.replace(/\.html$/, "").split(path.sep).join("/")}`;
    const html = await readFile(htmlPath, "utf8");
    for (const match of html.matchAll(/_next\/(static\/chunks\/[^"'\\\s]+\.js)/g)) {
      addRoute(match[1], route);
    }
  }

  return routeMap;
}

async function analyzeChunks() {
  phase("Analyzing .next/static/chunks");
  const chunksDirectory = path.join(nextDirectory, "static", "chunks");
  const chunkFiles = await walkFiles(chunksDirectory, (file) => file.endsWith(".js"));
  const routeMap = await loadChunkRouteMap();
  const records = [];

  for (const file of chunkFiles) {
    const fileStat = await stat(file);
    const content = await readFile(file);
    const gzipSize = (await gzipAsync(content)).byteLength;
    const relativePath = path.relative(projectRoot, file).split(path.sep).join("/");
    const nextRelativePath = path.relative(nextDirectory, file).split(path.sep).join("/");
    records.push({
      file: relativePath,
      bytes: fileStat.size,
      gzipBytes: gzipSize,
      routes: [...(routeMap.get(nextRelativePath) ?? [])],
    });
  }

  records.sort((a, b) => b.bytes - a.bytes);
  console.log(
    `${paint("✓", "green")} Found ${records.length} JavaScript chunks totaling ${formatBytes(
      records.reduce((total, record) => total + record.bytes, 0),
    )}`,
  );
  return records;
}

function countOccurrences(content, pattern) {
  let count = 0;
  let index = 0;
  while ((index = content.indexOf(pattern, index)) !== -1) {
    count += 1;
    index += Math.max(pattern.length, 1);
  }
  return count;
}

async function searchProductionChunks(chunks) {
  phase("Searching production chunks for requested performance markers");
  const results = Object.fromEntries(productionSearchTerms.map((term) => [term, []]));
  const knownChunks = new Map(chunks.map((chunk) => [chunk.file, chunk]));
  const staticChunkFiles = await walkFiles(path.join(nextDirectory, "static", "chunks"), (file) =>
    /\.(?:js|css)$/.test(file),
  );

  for (const absoluteFile of staticChunkFiles) {
    const relativeFile = path.relative(projectRoot, absoluteFile).split(path.sep).join("/");
    const existing = knownChunks.get(relativeFile);
    const fileStat = existing ? null : await stat(absoluteFile);
    const record = existing ?? {
      file: relativeFile,
      bytes: fileStat.size,
      routes: [],
    };
    const content = await readFile(absoluteFile, "utf8");
    for (const term of productionSearchTerms) {
      const count = countOccurrences(content, term);
      if (count > 0) {
        results[term].push({
          file: record.file,
          count,
          bytes: record.bytes,
          routes: record.routes,
        });
      }
    }
  }

  return results;
}

function extractImageTags(content) {
  const tags = [];
  const matcher = /<Image\b[\s\S]*?(?:\/>|>)/g;
  for (const match of content.matchAll(matcher)) {
    tags.push({
      markup: match[0],
      index: match.index ?? 0,
      line: lineNumberAt(content, match.index ?? 0),
    });
  }
  return tags;
}

function extractSrc(markup) {
  const quoted = markup.match(/\bsrc\s*=\s*["']([^"']+)["']/);
  if (quoted) return quoted[1];
  const expression = markup.match(/\bsrc\s*=\s*{([^}]+)}/);
  return expression ? `{${expression[1].trim()}}` : "unknown";
}

function tagPatternLine(tag, pattern) {
  const match = tag.markup.match(pattern);
  if (!match || match.index === undefined) return tag.line;
  return tag.line + tag.markup.slice(0, match.index).split("\n").length - 1;
}

async function scanSourceForImageIssues() {
  phase("Scanning source files for invalid Next Image usage");
  const sourceRoots = ["app", "components", "lib"].map((directory) =>
    path.join(projectRoot, directory),
  );
  const sourceFiles = (
    await Promise.all(
      sourceRoots.map((directory) =>
        walkFiles(directory, (file) => /\.(?:[cm]?[jt]sx?|css)$/.test(file)),
      ),
    )
  ).flat();

  const findings = [];
  const priorityImages = [];
  const sourceMarkers = Object.fromEntries(productionSearchTerms.map((term) => [term, []]));
  const publicFiles = await walkFiles(publicDirectory, () => true);
  const publicRelativeFiles = new Set(
    publicFiles.map((file) => `/${path.relative(publicDirectory, file).split(path.sep).join("/")}`),
  );
  const missingAssetKeys = new Set();

  for (const file of sourceFiles) {
    const content = await readFile(file, "utf8");
    const relativeFile = path.relative(projectRoot, file).split(path.sep).join("/");

    for (const term of productionSearchTerms) {
      let index = 0;
      while ((index = content.indexOf(term, index)) !== -1) {
        sourceMarkers[term].push({
          file: relativeFile,
          line: lineNumberAt(content, index),
        });
        index += Math.max(term.length, 1);
      }
    }

    const staticAssetPattern =
      /(["'`])(\/(?!\/)[^"'`?#]+\.(?:avif|gif|jpe?g|png|svg|webp))\1/gi;
    for (const match of content.matchAll(staticAssetPattern)) {
      const assetPath = match[2];
      if (publicRelativeFiles.has(assetPath)) continue;
      const key = `${relativeFile}:${assetPath}`;
      if (missingAssetKeys.has(key)) continue;
      missingAssetKeys.add(key);

      const parsed = path.posix.parse(assetPath);
      const alternatives = [...publicRelativeFiles].filter((candidate) => {
        const candidateParsed = path.posix.parse(candidate);
        return candidateParsed.dir === parsed.dir && candidateParsed.name === parsed.name;
      });
      findings.push({
        severity: "critical",
        type: "missing-public-image",
        file: relativeFile,
        line: lineNumberAt(content, match.index ?? 0),
        src: assetPath,
        alternatives,
        message: `Referenced public image ${assetPath} does not exist.${
          alternatives.length ? ` Existing alternative: ${alternatives.join(", ")}.` : ""
        }`,
      });
    }

    const importsNextImage = /from\s+["']next\/image["']/.test(content);
    if (!importsNextImage) continue;

    for (const tag of extractImageTags(content)) {
      const location = `${relativeFile}:${tag.line}`;
      const src = extractSrc(tag.markup);
      if (/\bquality\s*=\s*{\s*0\s*}/.test(tag.markup)) {
        findings.push({
          severity: "critical",
          type: "quality-zero",
          file: relativeFile,
          line: tagPatternLine(tag, /\bquality\s*=\s*{\s*0\s*}/),
          src,
          message: "Next Image uses quality={0}, which is invalid.",
        });
      }
      if (/\bquality\s*=\s*{\s*25\s*}/.test(tag.markup)) {
        findings.push({
          severity: "critical",
          type: "quality-25",
          file: relativeFile,
          line: tagPatternLine(tag, /\bquality\s*=\s*{\s*25\s*}/),
          src,
          message:
            "Next Image uses quality={25}; Next 16 rejects qualities not allowed by images.qualities.",
        });
      }
      if (/\bquality\s*=\s*{\s*undefined\s*}/.test(tag.markup)) {
        findings.push({
          severity: "high",
          type: "quality-undefined",
          file: relativeFile,
          line: tagPatternLine(tag, /\bquality\s*=\s*{\s*undefined\s*}/),
          src,
          message: "Next Image explicitly receives an undefined quality.",
        });
      }
      if (/\bfill(?:\s|\/|>)/.test(tag.markup) && !/\bsizes\s*=/.test(tag.markup)) {
        findings.push({
          severity: "high",
          type: "fill-missing-sizes",
          file: relativeFile,
          line: tagPatternLine(tag, /\bfill(?:\s|\/|>)/),
          src,
          message: "Next Image uses fill without a sizes prop.",
        });
      }
      if (/\bpriority(?:\s|=|\/|>)/.test(tag.markup)) {
        priorityImages.push({ file: relativeFile, line: tag.line, src, location });
      }
    }
  }

  const prioritiesBySrc = new Map();
  for (const image of priorityImages) {
    if (!prioritiesBySrc.has(image.src)) prioritiesBySrc.set(image.src, []);
    prioritiesBySrc.get(image.src).push(image);
  }
  for (const [src, images] of prioritiesBySrc) {
    if (images.length < 2) continue;
    for (const image of images) {
      findings.push({
        severity: "high",
        type: "duplicate-priority-image",
        file: image.file,
        line: image.line,
        src,
        message: `The same image is marked priority ${images.length} times.`,
      });
    }
  }
  if (priorityImages.length > 2) {
    findings.push({
      severity: "medium",
      type: "excessive-priority-images",
      file: priorityImages.map((image) => image.location).join(", "),
      line: null,
      src: null,
      message: `${priorityImages.length} images are marked priority, which can compete for bandwidth.`,
    });
  }

  console.log(
    `${findings.length === 0 ? paint("✓", "green") : paint("!", "yellow")} Found ${
      findings.length
    } source image issue(s) across ${sourceFiles.length} source files`,
  );
  return {
    findings,
    priorityImages,
    sourceMarkers,
    scannedFileCount: sourceFiles.length,
  };
}

function extractServerImageErrors(log) {
  const lines = log.split(/\r?\n/);
  return lines
    .map((text, index) => ({ line: index + 1, text }))
    .filter(
      ({ text }) =>
        /(?:error|invalid|isn't a valid|not a valid|failed|400|404|500)/i.test(text) &&
        /image|_next\/image|quality|optimizer|upstream/i.test(text),
    )
    .slice(0, 100);
}

function sumNumericItems(items, keys) {
  return items.reduce((total, item) => {
    for (const key of keys) {
      if (Number.isFinite(item?.[key])) return total + item[key];
    }
    return total;
  }, 0);
}

function originalAssetFromUrl(resourceUrl) {
  if (!resourceUrl) return null;
  try {
    const parsed = new URL(resourceUrl, baseUrl);
    if (parsed.pathname === "/_next/image") {
      return parsed.searchParams.get("url") || parsed.pathname;
    }
    return parsed.pathname;
  } catch {
    return resourceUrl;
  }
}

function sourceAssetFromServerMessage(message) {
  return message?.match(/\/[A-Za-z0-9_./-]+\.(?:avif|gif|jpe?g|png|svg|webp)/i)?.[0] ?? null;
}

function createRankedDiagnosis({
  stages,
  browser,
  metrics,
  diagnostics,
  chunks,
  chunkSearch,
  sourceImages,
  serverImageErrors,
}) {
  const diagnosis = [];
  const diagnosisKeys = new Set();
  const add = (severity, category, title, evidence, likelyFiles = [], recommendation = "") => {
    const key = `${severity}\0${category}\0${title}\0${evidence}`;
    if (diagnosisKeys.has(key)) return;
    diagnosisKeys.add(key);
    diagnosis.push({
      severity,
      category,
      title,
      evidence,
      likelyFiles: [...new Set(likelyFiles.filter(Boolean))],
      recommendation,
    });
  };

  for (const stage of stages) {
    if (!stage.succeeded) {
      add(
        "critical",
        "validation",
        `${stage.label} failed`,
        `Exit code ${stage.code}. Review the command output above.`,
        [],
        `Fix ${stage.label.toLowerCase()} before trusting production performance results.`,
      );
    }
  }

  for (const finding of sourceImages.findings) {
    add(
      finding.severity,
      "image",
      finding.message,
      `${finding.file}${finding.line ? `:${finding.line}` : ""} (${finding.src ?? "unknown src"})`,
      [finding.file],
      finding.type === "quality-25"
        ? "Use an allowed image quality or configure images.qualities in next.config."
        : finding.type === "missing-public-image"
          ? `Point the source at an existing public asset${
              finding.alternatives?.length ? ` such as ${finding.alternatives.join(", ")}` : ""
            }, or add the missing file.`
          : "Correct the Image props and rerun this audit.",
    );
  }

  for (const error of browser.pageErrors) {
    add(
      "critical",
      "runtime",
      "Uncaught browser runtime error",
      error.text,
      [],
      "Trace the stack to the source component and eliminate the production-only exception.",
    );
  }

  const failedResourceUrls = new Set(browser.failedRequests.map((resource) => resource.url));
  const seenConsoleErrors = new Set();
  for (const error of browser.consoleErrors) {
    if (/failed to load resource/i.test(error.text) && failedResourceUrls.has(error.url)) continue;
    const key = `${error.text}\0${error.url ?? ""}`;
    if (seenConsoleErrors.has(key)) continue;
    seenConsoleErrors.add(key);
    add(
      "high",
      "console",
      "Browser console error",
      error.text,
      [error.url],
      "Reproduce in a production browser session and fix the originating component or resource.",
    );
  }

  const failedResourceGroups = new Map();
  for (const resource of browser.failedRequests) {
    const groupKey = originalAssetFromUrl(resource.url) ?? resource.url;
    if (!failedResourceGroups.has(groupKey)) failedResourceGroups.set(groupKey, []);
    failedResourceGroups.get(groupKey).push(resource);
  }
  for (const [asset, resources] of failedResourceGroups) {
    const statuses = [...new Set(resources.map((resource) => resource.status).filter(Boolean))];
    const urls = [...new Set(resources.map((resource) => resource.url).filter(Boolean))];
    const hasServerFailure = statuses.some((status) => status >= 500);
    add(
      hasServerFailure ? "critical" : "high",
      "network",
      `Failed resource: ${asset}`,
      `${statuses.length ? `HTTP ${statuses.join("/")}; ` : ""}${urls.length} failed request variant(s).`,
      urls,
      /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(asset)
        ? "Verify the public image exists, then validate its Next Image quality and sizes settings."
        : "Fix the URL/server response and verify the resource is available in the production build.",
    );
  }

  const knownMissingAssets = new Set(
    sourceImages.findings
      .filter((finding) => finding.type === "missing-public-image")
      .map((finding) => finding.src),
  );
  const unexplainedImageErrors = new Map();
  for (const error of [...browser.imageErrors, ...serverImageErrors]) {
    const source =
      originalAssetFromUrl(error.url) ?? sourceAssetFromServerMessage(error.text) ?? error.url;
    if (knownMissingAssets.has(source) || failedResourceGroups.has(source)) continue;
    const key = source ?? error.text ?? "unknown image";
    if (!unexplainedImageErrors.has(key)) unexplainedImageErrors.set(key, []);
    unexplainedImageErrors.get(key).push(error);
  }
  for (const [source, errors] of unexplainedImageErrors) {
    add(
      "high",
      "image",
      `Image optimization or delivery error: ${source}`,
      `${errors.length} related browser/server error(s).`,
      errors.map((error) => error.url),
      "Validate Next Image src, quality, sizes, source file availability, and optimizer response.",
    );
  }

  for (const warning of metrics.warnings ?? []) {
    add(
      "high",
      "lighthouse",
      "Lighthouse reported an incomplete or unstable page load",
      warning,
      [],
      "Treat extreme lab metrics cautiously, then remove continuous main-thread/paint work and rerun.",
    );
  }
  if (metrics.runtimeError) {
    add(
      "critical",
      "lighthouse",
      "Lighthouse runtime error",
      metrics.runtimeError.message ?? JSON.stringify(metrics.runtimeError),
      [],
      "Resolve the runtime error before relying on the Lighthouse score.",
    );
  }

  const score = metrics.performanceScore;
  if (score !== null && score < 90) {
    add(
      score < 50 ? "critical" : score < 75 ? "high" : "medium",
      "lighthouse",
      `Lighthouse mobile performance score is ${score}`,
      `Target is at least 90; current score is ${score}.`,
      [],
      "Prioritize the metric and opportunity findings below, then rerun under the same conditions.",
    );
  }

  const metricRules = [
    ["LCP", metrics.lcp.numericValue, 2_500, 4_000, metrics.lcp.displayValue],
    ["FCP", metrics.fcp.numericValue, 1_800, 3_000, metrics.fcp.displayValue],
    ["TBT", metrics.tbt.numericValue, 200, 600, metrics.tbt.displayValue],
    ["Speed Index", metrics.speedIndex.numericValue, 3_400, 5_800, metrics.speedIndex.displayValue],
  ];
  for (const [name, value, warning, critical, display] of metricRules) {
    if (!Number.isFinite(value) || value <= warning) continue;
    add(
      value > critical ? "critical" : "high",
      "metric",
      `${name} is slow (${display})`,
      `${name} exceeds the mobile target of ${formatMilliseconds(warning)}.`,
      [],
      name === "TBT"
        ? "Reduce main-thread JavaScript, long tasks, hydration work, and expensive client effects."
        : "Reduce critical-path work and bytes; optimize the LCP element and render-blocking resources.",
    );
  }
  if (Number.isFinite(metrics.cls.numericValue) && metrics.cls.numericValue > 0.1) {
    add(
      metrics.cls.numericValue > 0.25 ? "critical" : "high",
      "metric",
      `CLS is high (${metrics.cls.displayValue})`,
      "CLS should be 0.1 or lower.",
      [],
      "Reserve layout space for images/content and avoid layout-changing work after first render.",
    );
  }

  const longTaskItems = diagnostics.longTasks.items;
  const longTaskDuration = sumNumericItems(longTaskItems, ["duration"]);
  if (longTaskItems.length > 0) {
    add(
      longTaskDuration > 600 ? "high" : "medium",
      "javascript",
      `${longTaskItems.length} long main-thread task(s)`,
      `Combined listed duration: ${formatMilliseconds(longTaskDuration)}.`,
      longTaskItems.map((item) => item.url),
      "Break up work over 50 ms, defer non-critical hydration, and reduce client-side component scope.",
    );
  }

  const mainThreadValue = diagnostics.mainThreadWork.numericValue;
  if (Number.isFinite(mainThreadValue) && mainThreadValue > 2_000) {
    add(
      mainThreadValue > 4_000 ? "high" : "medium",
      "javascript",
      `Main-thread work is ${formatMilliseconds(mainThreadValue)}`,
      diagnostics.mainThreadWork.displayValue ?? "See Lighthouse main-thread breakdown.",
      [],
      "Focus on script evaluation, style/layout, and rendering categories with the largest durations.",
    );
  }

  const unusedItems = diagnostics.unusedJavaScript.items;
  const wastedBytes = sumNumericItems(unusedItems, ["wastedBytes"]);
  if (wastedBytes > 0) {
    add(
      wastedBytes > 100 * 1024 ? "high" : "medium",
      "javascript",
      `${formatBytes(wastedBytes)} of unused JavaScript`,
      `${unusedItems.length} script(s) contain potentially removable bytes.`,
      unusedItems.map((item) => item.url),
      "Move static UI to Server Components, dynamically load optional interactions, and import narrowly.",
    );
  }

  if (diagnostics.renderBlockingRequests.items.length > 0) {
    add(
      "medium",
      "rendering",
      `${diagnostics.renderBlockingRequests.items.length} render-blocking request(s)`,
      diagnostics.renderBlockingRequests.displayValue ?? "See Lighthouse report for savings.",
      diagnostics.renderBlockingRequests.items.map((item) => item.url),
      "Inline only critical CSS and defer or remove non-critical styles/scripts from the initial path.",
    );
  }

  const imageAuditItems = diagnostics.imageDeliveryIssues.flatMap((audit) => audit.items);
  const imageSavings = sumNumericItems(imageAuditItems, ["wastedBytes", "wastedMs"]);
  if (imageAuditItems.length > 0) {
    add(
      "high",
      "image",
      `${imageAuditItems.length} Lighthouse image delivery issue(s)`,
      imageSavings ? `Potential listed savings: ${formatBytes(imageSavings)}.` : "See image audits.",
      imageAuditItems.map((item) => item.url),
      "Serve correctly sized images, use valid Next Image settings, and avoid oversized background assets.",
    );
  }

  if (diagnostics.nonCompositedAnimations.items.length > 0) {
    const animationEvidence = diagnostics.nonCompositedAnimations.items
      .flatMap((item) => [
        item.node?.selector,
        ...(item.subItems?.items ?? []).map(
          (subItem) =>
            `${subItem.animation ?? "animation"}: ${subItem.failureReason ?? "not composited"}`,
        ),
      ])
      .filter(Boolean)
      .join("; ");
    const animationSourceFiles = (sourceImages.sourceMarkers?.["background-position"] ?? []).map(
      (marker) => `${marker.file}:${marker.line}`,
    );
    add(
      "high",
      "animation",
      `${diagnostics.nonCompositedAnimations.items.length} non-composited animation(s)`,
      animationEvidence || "These animations can trigger paint/layout work on every frame.",
      animationSourceFiles,
      "Animate transform and opacity; avoid background-position, blur, and layout properties on large layers.",
    );
  }

  const largeChunks = chunks.filter((chunk) => chunk.gzipBytes > 100 * 1024 || chunk.bytes > 250 * 1024);
  for (const chunk of largeChunks.slice(0, 5)) {
    add(
      "high",
      "bundle",
      `Large JavaScript chunk: ${path.basename(chunk.file)}`,
      `${formatBytes(chunk.bytes)} raw / ${formatBytes(chunk.gzipBytes)} gzip${
        chunk.routes.length ? `; routes: ${chunk.routes.join(", ")}` : ""
      }.`,
      [chunk.file],
      "Inspect imports in the owning route and split or remove client-only dependencies.",
    );
  }

  const framerMotionMatches = chunkSearch["framer-motion"] ?? [];
  if (framerMotionMatches.length > 0) {
    add(
      "medium",
      "bundle",
      'Production chunks contain "framer-motion"',
      `${framerMotionMatches.length} chunk(s), ${framerMotionMatches.reduce(
        (sum, item) => sum + item.count,
        0,
      )} match(es).`,
      framerMotionMatches.map((item) => item.file),
      "Confirm the animation library is necessary above the fold and import only the APIs in use.",
    );
  }

  const expensiveCssFiles = [];
  for (const term of ["backdrop-blur", "blur-", "background-position"]) {
    for (const match of chunkSearch[term] ?? []) expensiveCssFiles.push(match.file);
    for (const marker of sourceImages.sourceMarkers?.[term] ?? []) {
      expensiveCssFiles.push(`${marker.file}:${marker.line}`);
    }
  }
  if (expensiveCssFiles.length > 0) {
    add(
      "medium",
      "rendering",
      "Production output contains blur/backdrop/background-position effects",
      "Large blurred layers and background-position animations often increase paint and GPU cost.",
      expensiveCssFiles,
      "Reduce blurred surface area, avoid animating background-position, and test with effects disabled.",
    );
  }

  diagnosis.sort((a, b) => severityWeight[a.severity] - severityWeight[b.severity]);
  return diagnosis;
}

function printMetrics(metrics) {
  heading("Lighthouse mobile metrics");
  const rows = [
    ["Performance score", metrics.performanceScore === null ? "not available" : `${metrics.performanceScore}/100`],
    ["FCP", metrics.fcp.displayValue],
    ["LCP", metrics.lcp.displayValue],
    ["TBT", metrics.tbt.displayValue],
    ["CLS", metrics.cls.displayValue],
    ["INP", metrics.inp?.displayValue ?? "not available in this lab run"],
    ["Speed Index", metrics.speedIndex.displayValue],
  ];
  const width = Math.max(...rows.map(([label]) => label.length));
  for (const [label, value] of rows) console.log(`${label.padEnd(width)}  ${value}`);
  for (const warning of metrics.warnings ?? []) {
    console.log(`${paint("Warning:", "yellow")} ${warning}`);
  }
}

function printBrowserFindings(browser, serverImageErrors) {
  heading("Console, runtime, network, and image errors");
  const groups = [
    ["Console errors", browser.consoleErrors],
    ["Runtime errors", browser.pageErrors],
    ["Failed resources", browser.failedRequests],
    ["Browser image errors", browser.imageErrors],
    ["Server image errors", serverImageErrors],
  ];
  for (const [label, items] of groups) {
    console.log(`${label}: ${items.length}`);
    for (const item of items.slice(0, 10)) {
      console.log(`  - ${item.status ? `HTTP ${item.status} ` : ""}${item.url ?? item.text ?? item.errorText}`);
    }
    if (items.length > 10) console.log(`  ${paint(`… ${items.length - 10} more`, "dim")}`);
  }
}

function printDiagnostics(diagnostics) {
  heading("Lighthouse diagnostics");
  const rows = [
    ["Long tasks", diagnostics.longTasks.items.length, diagnostics.longTasks.displayValue],
    [
      "Main-thread work",
      diagnostics.mainThreadWork.items.length,
      diagnostics.mainThreadWork.displayValue ??
        formatMilliseconds(diagnostics.mainThreadWork.numericValue),
    ],
    [
      "Unused JavaScript",
      diagnostics.unusedJavaScript.items.length,
      diagnostics.unusedJavaScript.displayValue,
    ],
    [
      "Render-blocking requests",
      diagnostics.renderBlockingRequests.items.length,
      diagnostics.renderBlockingRequests.displayValue,
    ],
    [
      "Image delivery issues",
      diagnostics.imageDeliveryIssues.reduce((sum, audit) => sum + audit.items.length, 0),
      diagnostics.imageDeliveryIssues.map((audit) => audit.id).join(", ") || "none",
    ],
    [
      "Non-composited animations",
      diagnostics.nonCompositedAnimations.items.length,
      diagnostics.nonCompositedAnimations.displayValue,
    ],
  ];
  for (const [label, count, detail] of rows) {
    console.log(`${label}: ${count}${detail ? ` (${detail})` : ""}`);
  }
}

function printLargestChunks(chunks) {
  heading("Largest production JavaScript chunks");
  for (const [index, chunk] of chunks.slice(0, 15).entries()) {
    console.log(
      `${String(index + 1).padStart(2)}. ${formatBytes(chunk.bytes).padStart(10)} raw / ` +
        `${formatBytes(chunk.gzipBytes).padStart(10)} gzip  ${chunk.file}` +
        `${chunk.routes.length ? `  [${chunk.routes.join(", ")}]` : ""}`,
    );
  }
}

function printChunkSearch(chunkSearch) {
  heading("Production chunk marker search");
  for (const [term, matches] of Object.entries(chunkSearch)) {
    const count = matches.reduce((sum, match) => sum + match.count, 0);
    console.log(`${JSON.stringify(term)}: ${count} match(es) in ${matches.length} chunk(s)`);
    for (const match of matches.slice(0, 5)) {
      console.log(`  - ${match.file} (${match.count})`);
    }
  }
}

function printSourceMarkerSearch(sourceMarkers) {
  heading("Source marker search");
  for (const term of productionSearchTerms) {
    const matches = sourceMarkers?.[term] ?? [];
    console.log(`${JSON.stringify(term)}: ${matches.length} match(es)`);
    for (const match of matches.slice(0, 8)) {
      console.log(`  - ${match.file}:${match.line}`);
    }
  }
}

function printSourceImageFindings(sourceImages) {
  heading("Next Image source checks");
  console.log(`Source files scanned: ${sourceImages.scannedFileCount}`);
  console.log(`Priority images found: ${sourceImages.priorityImages.length}`);
  if (sourceImages.findings.length === 0) {
    console.log(`${paint("✓", "green")} No requested invalid Image patterns found`);
    return;
  }
  for (const finding of sourceImages.findings) {
    console.log(
      `${paint(finding.severity.toUpperCase(), finding.severity === "critical" ? "red" : "yellow")} ` +
        `${finding.file}${finding.line ? `:${finding.line}` : ""} — ${finding.message}`,
    );
  }
}

function printRankedDiagnosis(diagnosis) {
  heading("Final ranked diagnosis");
  if (diagnosis.length === 0) {
    console.log(`${paint("✓", "green")} No material production performance problems were detected.`);
    return;
  }

  diagnosis.forEach((item, index) => {
    const color =
      item.severity === "critical" ? "red" : item.severity === "high" ? "yellow" : "cyan";
    console.log(
      `\n${String(index + 1).padStart(2)}. ${paint(item.severity.toUpperCase(), color)} ` +
        `[${item.category}] ${item.title}`,
    );
    console.log(`    Evidence: ${item.evidence}`);
    if (item.likelyFiles.length > 0) {
      console.log(`    Likely files/resources: ${item.likelyFiles.slice(0, 8).join(", ")}`);
    }
    if (item.recommendation) console.log(`    Recommended fix: ${item.recommendation}`);
  });
}

async function writeAuditReport(report) {
  await writeFile(auditJsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(serverLogPath, serverLog, "utf8");
  heading("Reports");
  console.log(path.relative(projectRoot, lighthouseJsonPath));
  console.log(path.relative(projectRoot, lighthouseHtmlPath));
  console.log(path.relative(projectRoot, auditJsonPath));
  console.log(path.relative(projectRoot, serverLogPath));
}

async function main() {
  process.chdir(projectRoot);
  const startedAt = new Date();
  const stages = [];
  let browserFindings = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    imageErrors: [],
    navigationError: null,
    responseCount: 0,
    documentSummary: { title: null, readyState: null, images: [], resources: [] },
  };
  let lhr;
  let chunks = [];
  let chunkSearch = {};
  let sourceImages = {
    findings: [],
    priorityImages: [],
    sourceMarkers: Object.fromEntries(productionSearchTerms.map((term) => [term, []])),
    scannedFileCount: 0,
  };
  let fatalError = null;

  console.log(paint("Deep Production Performance Audit", "bold"));
  console.log(`Project: ${projectRoot}`);
  console.log(`Target:  ${baseUrl}`);
  console.log(`Started: ${startedAt.toISOString()}`);

  await mkdir(reportsDirectory, { recursive: true });

  try {
    await killPort(port);
    await removeNextBuild();

    stages.push(await runCommand("Production build", npmCommand, ["run", "build"]));
    stages.push(await runCommand("ESLint", npmCommand, ["run", "lint"]));
    stages.push(await runCommand("TypeScript noEmit", npxCommand, ["tsc", "--noEmit"]));

    if (!stages[0].succeeded || !(await pathExists(nextDirectory))) {
      throw new Error("Production build failed; browser and Lighthouse phases cannot run.");
    }

    startProductionServer();
    await waitForSite(baseUrl);

    const executablePath = await findChromiumExecutable();
    console.log(
      `Chromium executable: ${executablePath ?? "Playwright-managed browser (no system browser found)"}`,
    );

    browserFindings = await collectBrowserFindings(baseUrl, executablePath);
    lhr = await runLighthouseAudit(baseUrl, executablePath);

    chunks = await analyzeChunks();
    chunkSearch = await searchProductionChunks(chunks);
    sourceImages = await scanSourceForImageIssues();
  } catch (error) {
    fatalError = {
      message: error.message,
      stack: error.stack ?? null,
    };
    console.error(`\n${paint("AUDIT ERROR", "red")}: ${error.stack ?? error.message}`);
  } finally {
    await stopProductionServer();
  }

  const serverImageErrors = extractServerImageErrors(serverLog);
  const metrics = lhr
    ? extractMetrics(lhr)
    : {
        warnings: [],
        runtimeError: null,
        performanceScore: null,
        fcp: { numericValue: null, displayValue: "not available" },
        lcp: { numericValue: null, displayValue: "not available" },
        tbt: { numericValue: null, displayValue: "not available" },
        cls: { numericValue: null, displayValue: "not available" },
        inp: null,
        speedIndex: { numericValue: null, displayValue: "not available" },
      };
  const diagnostics = lhr
    ? extractDiagnostics(lhr)
    : {
        longTasks: { items: [] },
        mainThreadWork: { items: [], numericValue: null },
        unusedJavaScript: { items: [] },
        renderBlockingRequests: { items: [] },
        imageDeliveryIssues: [],
        nonCompositedAnimations: { items: [] },
      };

  const diagnosis = createRankedDiagnosis({
    stages,
    browser: browserFindings,
    metrics,
    diagnostics,
    chunks,
    chunkSearch,
    sourceImages,
    serverImageErrors,
  });
  if (fatalError) {
    diagnosis.unshift({
      severity: "critical",
      category: "audit",
      title: "The audit could not complete every phase",
      evidence: fatalError.message,
      likelyFiles: [],
      recommendation: "Resolve the reported audit environment or build failure and rerun.",
    });
  }

  printMetrics(metrics);
  printBrowserFindings(browserFindings, serverImageErrors);
  printDiagnostics(diagnostics);
  printLargestChunks(chunks);
  printChunkSearch(chunkSearch);
  printSourceMarkerSearch(sourceImages.sourceMarkers);
  printSourceImageFindings(sourceImages);
  printRankedDiagnosis(diagnosis);

  const completedAt = new Date();
  await writeAuditReport({
    metadata: {
      projectRoot,
      url: baseUrl,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMs: completedAt.getTime() - startedAt.getTime(),
      node: process.version,
      platform: process.platform,
      fatalError,
    },
    stages: stages.map(({ output, ...stage }) => ({
      ...stage,
      outputTail: output.slice(-20_000),
    })),
    metrics,
    diagnostics,
    browser: browserFindings,
    serverImageErrors,
    largestChunks: chunks.slice(0, 50),
    chunkSearch,
    sourceImages,
    diagnosis,
  });

  const validationFailed = stages.some((stage) => !stage.succeeded);
  if (fatalError || validationFailed || interrupted) process.exitCode = 1;
}

process.on("SIGINT", () => {
  interrupted = true;
  if (serverProcess?.pid) {
    try {
      if (process.platform === "win32") serverProcess.kill("SIGTERM");
      else process.kill(-serverProcess.pid, "SIGTERM");
    } catch {
      // Best effort during interruption.
    }
  }
});

process.on("SIGTERM", () => {
  interrupted = true;
  if (serverProcess?.pid) {
    try {
      if (process.platform === "win32") serverProcess.kill("SIGTERM");
      else process.kill(-serverProcess.pid, "SIGTERM");
    } catch {
      // Best effort during interruption.
    }
  }
});

await main();
