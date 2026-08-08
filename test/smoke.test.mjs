import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

test("package.json declares MIT and start/test scripts", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.license, "MIT");
  assert.ok(pkg.scripts?.start);
  assert.ok(pkg.scripts?.test);
});

test("Version.md declares formal flow and local test gate", () => {
  const text = readFileSync(join(root, "Version.md"), "utf8");
  assert.match(text, /dev_flow:\s*formal/);
  assert.match(text, /test_gate:\s*local/);
});

test("seed license and readme exist", () => {
  assert.ok(existsSync(join(root, "LICENSE")));
  assert.ok(existsSync(join(root, "README.md")));
});
