#!/bin/bash
# Clear Vite and Turbo caches

echo "Clearing Vite caches..."
rm -rf node_modules/.vite
rm -rf apps/web/real-estate/.vite  
rm -rf apps/web/restaurant/.vite
rm -rf .turbo

echo "Cache cleared! Restart your dev server with: npm run dev"
