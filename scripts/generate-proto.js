#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const fg = require("fast-glob");

// ----------------------------------------------------------------------------
// Paths
// ----------------------------------------------------------------------------

const ROOT_DIR = path.resolve(__dirname, "..");

const PROTO_SRC = path.join(ROOT_DIR, "packages/proto");
const GEN_DIR = path.join(
  ROOT_DIR,
  "packages/proto-gen/src/generated"
);
const INDEX_FILE = path.join(
  ROOT_DIR,
  "packages/proto-gen/src/index.ts"
);

// Platform-specific paths for protoc and ts-proto plugin
const PROTOC = process.platform === "win32"
  ? path.join(ROOT_DIR, "node_modules/.bin/protoc.cmd")
  : path.join(ROOT_DIR, "node_modules/.bin/protoc");

const TS_PROTO_PLUGIN = process.platform === "win32"
  ? path.join(ROOT_DIR, "node_modules/.bin/protoc-gen-ts_proto.cmd")
  : path.join(ROOT_DIR, "node_modules/.bin/protoc-gen-ts_proto");

// ----------------------------------------------------------------------------
// Pre-checks
// ----------------------------------------------------------------------------

if (!fs.existsSync(PROTOC)) {
  console.error("❌ protoc not found. Run: pnpm add -D protoc");
  process.exit(1);
}

if (!fs.existsSync(TS_PROTO_PLUGIN)) {
  console.error(
    "❌ protoc-gen-ts_proto not found. Run: pnpm add -D ts-proto"
  );
  process.exit(1);
}

// ----------------------------------------------------------------------------
// Step 1: Create output directory
// ----------------------------------------------------------------------------

fs.mkdirSync(GEN_DIR, { recursive: true });

// ----------------------------------------------------------------------------
// Step 2: Find all .proto files (cross-platform)
// ----------------------------------------------------------------------------

console.log("🔍 Scanning for .proto files...");

const protos = fg.sync("**/*.proto", {
  cwd: PROTO_SRC,
  absolute: true,
});

if (!protos.length) {
  console.log("⚠️  No .proto files found.");
  process.exit(0);
}

// ----------------------------------------------------------------------------
// Step 3: Generate TypeScript using ts-proto
// ----------------------------------------------------------------------------

const cmd = [
  `"${PROTOC}"`,
  `--plugin=protoc-gen-ts_proto="${TS_PROTO_PLUGIN}"`,
  `--ts_proto_out="${GEN_DIR}"`,
  `--ts_proto_opt=useOptionals=messages,esModuleInterop=true,exportCommonSymbols=false`,
  `-I "${PROTO_SRC}"`,
  ...protos.map((p) => `"${p}"`),
].join(" ");

execSync(cmd, { stdio: "inherit" });

// ----------------------------------------------------------------------------
// Step 4: Generate index.ts barrel file
// ----------------------------------------------------------------------------

console.log("🧠 Generating index.ts barrel file...");

const generatedFiles = fs
  .readdirSync(GEN_DIR)
  .filter(
    (file) =>
      file.endsWith(".ts") &&
      !file.endsWith(".d.ts") &&
      file !== "index.ts"
  );

if (!generatedFiles.length) {
  console.log("⚠️ No generated .ts files found.");
  process.exit(0);
}

const exportLines = generatedFiles.map((file) => {
  const name = file.replace(".ts", "");
  return `export * from "./generated/${name}";`;
});

fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
fs.writeFileSync(INDEX_FILE, exportLines.join("\n") + "\n");

console.log("✅ index.ts generated successfully.");
console.log("🚀 Done.");