import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const at = (...parts) => join(root, ...parts);

function read(relPath) {
  assert.ok(existsSync(at(relPath)), `missing required file: ${relPath}`);
  return readFileSync(at(relPath), "utf8");
}

function appFiles() {
  if (!existsSync(at("app"))) return [];
  return readdirSync(at("app"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
}

// --- repo surface -----------------------------------------------------------

test("package.json declares MIT and start/test scripts", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.license, "MIT");
  assert.ok(pkg.scripts?.start);
  assert.ok(pkg.scripts?.test);
  assert.match(pkg.scripts.start, /\bapp\b/, "npm start must serve app/");
});

test("Version.md declares formal flow and local test gate", () => {
  const text = read("Version.md");
  assert.match(text, /dev_flow:\s*formal/);
  assert.match(text, /test_gate:\s*local/);
});

test("seed license and readme exist", () => {
  assert.ok(existsSync(at("LICENSE")));
  assert.ok(existsSync(at("README.md")));
});

test("CI runs the canonical suite on pull requests", () => {
  const ci = read(".github/workflows/ci.yml");
  assert.match(ci, /pull_request/);
  assert.match(ci, /npm test/);
});

// --- app surface ------------------------------------------------------------
// These fail until the app lane's work is integrated. That is intentional:
// the canonical suite is what proves the merged tree is shippable.

test("app/index.html exists", () => {
  assert.ok(
    existsSync(at("app", "index.html")),
    "app/index.html is missing — the reference app has not been integrated",
  );
});

test("app is a standalone multi-file page, not a visualize bundle", () => {
  const html = read(join("app", "index.html"));
  assert.match(html, /<!doctype html>/i, "app/index.html must be a full document");
  assert.doesNotMatch(html, /srcdoc/i, "app/index.html must not ship visualize srcdoc chrome");
  assert.match(html, /<link[^>]+rel=["']?stylesheet/i, "app/index.html must link an external stylesheet");
  assert.match(html, /<script[^>]+src=/i, "app/index.html must load an external script");

  const files = appFiles();
  assert.ok(files.some((f) => f.endsWith(".css")), "app/ must contain a stylesheet file");
  assert.ok(files.some((f) => f.endsWith(".js")), "app/ must contain a script file");
});

test("app exposes the ball / cow / pizza object picker", () => {
  const html = read(join("app", "index.html"));
  for (const kind of ["ball", "cow", "pizza"]) {
    assert.match(html, new RegExp(kind, "i"), `app/index.html is missing the "${kind}" control hook`);
  }
});

// --- bench surface ----------------------------------------------------------

test("bench harness files exist", () => {
  for (const relPath of [
    join("prompts", "oneshot.md"),
    join("prompts", "improve.md"),
    join("outputs", "README.md"),
    join("docs", "BENCH.md"),
  ]) {
    assert.ok(existsSync(at(relPath)), `missing required file: ${relPath}`);
  }
});
