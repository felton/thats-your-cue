#!/bin/sh
# Rebuilds public/favicon.ico from assets/favicon-tile.svg.
# Renders the SVG with vips (or GraphicsMagick), then packs the PNGs with
# scripts/png-to-ico.mjs, since neither tool can write .ico files.
#   macOS: brew install vips   (or: brew install graphicsmagick)
set -eu

src="assets/favicon-tile.svg"
out="public/favicon.ico"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for size in 16 32 48; do
  if command -v vips >/dev/null 2>&1; then
    vips thumbnail "$src" "$tmp/$size.png" "$size"
  elif command -v gm >/dev/null 2>&1; then
    gm convert -background none -density 384 "$src" -resize "${size}x${size}" "$tmp/$size.png"
  else
    echo "favicon: install vips or GraphicsMagick first (brew install vips)" >&2
    exit 1
  fi
done

node scripts/png-to-ico.mjs "$out" "$tmp/16.png" "$tmp/32.png" "$tmp/48.png"
