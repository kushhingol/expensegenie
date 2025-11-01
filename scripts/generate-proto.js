#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const PROTO_SRC = path.resolve(__dirname, "../packages/proto");
const GEN_DIR = path.resolve(__dirname, "../packages/proto-gen/src/generated");
const INDEX_FILE = path.resolve(
  __dirname,
  "../packages/proto-gen/src/index.ts"
);

// ----------------------------------------------------------------------------
// Step 1: Create output directory if missing
// ----------------------------------------------------------------------------
if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR, { recursive: true });

// ----------------------------------------------------------------------------
// Step 2: Find all .proto files
// ----------------------------------------------------------------------------
console.log("🔍 Scanning for .proto files...");
const protos = execSync(`find ${PROTO_SRC} -name "*.proto"`, {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

if (protos.length === 0) {
  console.log("⚠️  No .proto files found.");
  process.exit(0);
}

// ----------------------------------------------------------------------------
// Step 3: Generate TypeScript proto output using ts-proto
// ----------------------------------------------------------------------------
console.log("🔧 Generating TypeScript from protobuf...");

const cmd = [
  "protoc",
  `--plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto`,
  `--ts_proto_out=${GEN_DIR}`,
  `--ts_proto_opt=useOptionals=messages,esModuleInterop=true`,
  `-I ${PROTO_SRC}`,
  ...protos,
].join(" ");

console.log("▶️ Running:", cmd);
execSync(cmd, { stdio: "inherit" });

console.log("✅ Protobuf generation completed.");

// ----------------------------------------------------------------------------
// Step 4: Generate a clean index.ts (no duplicates, always fresh)
// ----------------------------------------------------------------------------
console.log("🧠 Generating index.ts barrel file...");

// Read all .ts files inside generated/
const generatedFiles = fs
  .readdirSync(GEN_DIR)
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"));

if (!generatedFiles.length) {
  console.log("⚠️ No generated .ts files found. Skipping index.ts creation.");
  process.exit(0);
}

// Always rewrite index.ts from scratch (avoids duplicates)
const exportLines = generatedFiles.map((file) => {
  const fileName = file.replace(".ts", "");
  return `export * from "./generated/${fileName}";`;
});

// Ensure directory exists (e.g., first-time run)
fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });

// Write clean exports
fs.writeFileSync(INDEX_FILE, exportLines.join("\n") + "\n");

console.log("✅ index.ts generated successfully.");
console.log("🚀 Done.");
