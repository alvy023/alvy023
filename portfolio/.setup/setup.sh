#!/bin/bash
# Run from top level dir

# Move to frontend dir
cd portfolio/frontend

# Install Bun
curl -fsSL https://bun.com/install | bash

# Install dependencies (Astro)
bun install

# Run dev/build server
bun run dev
#bun run build
