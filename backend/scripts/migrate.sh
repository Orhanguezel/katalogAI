#!/bin/bash
# KatalogAI — Production DB Migration Script
# Kullanim:
#   ./scripts/migrate.sh              # Tum schema SQL'lerini calistir (seed/data yok)
#   ./scripts/migrate.sh --only=113   # Sadece belirli dosyayi calistir
#   ./scripts/migrate.sh --seed       # Schema + seed (sadece ilk kurulum)
#
# ONEMLI: Bu script DROP yapmaz. Sadece CREATE IF NOT EXISTS + ALTER yapar.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

cd "$BACKEND_DIR"

# Schema dosyalari (seed haric)
SCHEMA_FILES=(
  "10_auth_schema.sql"
  "60_site_settings_schema.sql"
  "61_theme_config.sql"
  "94_storage_assets.sql"
  "95_contact_messages.sql"
  "95_integration_settings_seed.sql"
  "108_audit_schema.sql"
  "109_categories_schema.sql"
  "110_email_templates_schema.sql"
  "111_gallery_schema.sql"
  "112_telegram_schema.sql"
)

if [[ "${1:-}" == "--seed" ]]; then
  echo ">>> Tam seed (schema + data) — ilk kurulum modu"
  bun src/db/seed/index.ts --no-drop
  exit 0
fi

if [[ "${1:-}" =~ ^--only= ]]; then
  ONLY="${1#--only=}"
  echo ">>> Sadece: $ONLY"
  bun src/db/seed/index.ts --no-drop --only="$ONLY"
  exit 0
fi

echo ">>> Schema migration (--no-drop, sadece schema dosyalari)"
# Schema prefix'lerini cikar ve --only ile calistir
PREFIXES=""
for f in "${SCHEMA_FILES[@]}"; do
  PREFIX=$(echo "$f" | grep -oP '^\d+')
  if [[ -n "$PREFIXES" ]]; then
    PREFIXES="$PREFIXES,$PREFIX"
  else
    PREFIXES="$PREFIX"
  fi
done

bun src/db/seed/index.ts --no-drop --only="$PREFIXES"

echo ">>> Migration tamamlandi."
