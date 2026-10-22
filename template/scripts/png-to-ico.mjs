#!/usr/bin/env node
// Packs PNG files into one .ico. No dependencies.
// Usage: node scripts/png-to-ico.mjs out.ico 16.png 32.png 48.png
//
// Modern .ico files can store PNG data directly, so each image is copied
// as-is behind a small directory header. Every browser and OS from the last
// decade reads this format.
import { readFileSync, writeFileSync } from "node:fs";

const [out, ...inputs] = process.argv.slice(2);
if (!out || inputs.length === 0) {
  console.error("Usage: node scripts/png-to-ico.mjs out.ico a.png [b.png ...]");
  process.exit(1);
}

const PNG_SIGNATURE = "89504e470d0a1a0a";
const images = inputs.map((file) => {
  const data = readFileSync(file);
  if (data.subarray(0, 8).toString("hex") !== PNG_SIGNATURE) {
    throw new Error(`${file} is not a PNG`);
  }
  // Width and height are big-endian uint32s in the IHDR chunk.
  return { data, width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
});

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

let offset = 6 + 16 * images.length;
const entries = images.map(({ data, width, height }) => {
  if (width > 256 || height > 256) throw new Error("ICO images max out at 256x256");
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width % 256, 0); // 0 means 256
  entry.writeUInt8(height % 256, 1);
  entry.writeUInt8(0, 2); // palette size (none)
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  return entry;
});

writeFileSync(out, Buffer.concat([header, ...entries, ...images.map((i) => i.data)]));
console.log(`Wrote ${out} (${images.map((i) => `${i.width}px`).join(", ")})`);
