#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const PROTO_SRC = path.resolve(__dirname, "../packages/proto");
const OUT_DIR = path.resolve(__dirname, "../packages/proto-gen/src");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log("🔧 Generating TS from .proto...");
/**
 * Using ts-proto:
 * protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto \
 *   --ts_out=...
 *
 * There are variations; ts-proto offers a plugin `protoc-gen-ts_proto`.
 */
const protos = execSync(`find ${PROTO_SRC} -name "*.proto"`, { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

if (protos.length === 0) {
  console.log("No .proto files found.");
  process.exit(0);
}

const protoArgs = protos.map((p) => `"${p}"`).join(" ");

const cmd = [
  "protoc",
  `--plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto`,
  `--ts_proto_out=${OUT_DIR}`,
  `--ts_proto_opt=useOptionals=true,esModuleInterop=true`,
  `-I ${PROTO_SRC}`,
  protoArgs,
].join(" ");

console.log("Running:", cmd);
execSync(cmd, { stdio: "inherit" });

console.log("✅ Protobuf generation done.");

