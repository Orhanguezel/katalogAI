#!/bin/bash
# =============================================================
# KatalogAI — Deploy to vps-vistainsaat (bereketfide.com/katalog)
#
# Kullanim:
#   ssh root@vps-vistainsaat
#   bash /www/wwwroot/katalogAI/deploy/deploy-bereketfide.sh
# =============================================================

set -e

APP_DIR="/www/wwwroot/katalogAI"
cd "$APP_DIR"

echo "📦 Git pull..."
git pull origin main

echo "📦 Backend bağımlılıklar..."
cd "$APP_DIR/backend"
bun install --frozen-lockfile

echo "🗃️ Veritabanı seed..."
bun run db:seed

echo "🔗 Symlink'ler..."
bash "$APP_DIR/backend/scripts/setup-symlinks.sh"

echo "📦 Admin panel bağımlılıklar + build..."
cd "$APP_DIR/admin_panel"
bun install --frozen-lockfile
NEXT_PUBLIC_BASE_PATH=/katalog \
NEXT_PUBLIC_API_URL=https://www.bereketfide.com/katalog/api \
bun run build

echo "🔄 PM2 restart..."
pm2 restart katalogai-backend katalogai-admin 2>/dev/null || \
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"

pm2 save

echo ""
echo "✅ Deploy tamamlandı!"
echo "   Backend: http://127.0.0.1:8083"
echo "   Admin:   http://127.0.0.1:3030"
echo "   URL:     https://www.bereketfide.com/katalog"
