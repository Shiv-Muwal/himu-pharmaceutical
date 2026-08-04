#!/usr/bin/env bash
# Quick recovery when admin login shows 502 / Request failed.
# Run on the EC2 box:
#   bash /var/www/Himu/himu-pharmaceutical/deploy/fix-api.sh

set -euo pipefail
ROOT="/var/www/Himu/himu-pharmaceutical"
cd "$ROOT/himu-backend"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env — edit JWT_SECRET / MONGODB_URI if needed"
fi

grep -q "sitetest.himupharmaceutical.com" .env || \
  echo 'CLIENT_URL=http://localhost:5173,http://localhost:5174,https://sitetest.himupharmaceutical.com,https://himupharmaceutical.com,https://www.himupharmaceutical.com' >> .env

npm install --omit=dev

pm2 delete himu-backend >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --update-env
pm2 save

echo "Waiting for health..."
for i in $(seq 1 15); do
  if curl -sf "http://127.0.0.1:5001/api/health" >/dev/null; then
    echo "OK — API healthy on :5001"
    curl -s "http://127.0.0.1:5001/api/health"
    echo
    exit 0
  fi
  sleep 1
done

echo "FAILED — backend still unhealthy. Recent logs:"
pm2 logs himu-backend --lines 50 --nostream || true
exit 1
