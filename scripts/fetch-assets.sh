#!/bin/sh
set -e

if [ -z "$ASSETS_URL" ]; then
  echo "[fetch-assets] ASSETS_URL not set — skipping"
  exit 0
fi

echo "[fetch-assets] Downloading from $ASSETS_URL"
mkdir -p public/images
curl -fsSL "$ASSETS_URL" | tar -xz -C public/images
echo "[fetch-assets] Done"
