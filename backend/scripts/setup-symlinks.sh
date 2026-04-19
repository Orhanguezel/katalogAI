#!/bin/bash
# =============================================================
# KatalogAI — Kaynak veritabanı uploads symlink'leri
# Bu script seed sonrası veya ilk kurulumda çalıştırılmalı
# =============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ECOSYSTEM_ROOT="$(cd "$PROJECT_ROOT/../.." && pwd)"
UPLOADS_DIR="$PROJECT_ROOT/backend/uploads"
mkdir -p "$UPLOADS_DIR"

# Bereket Fide
ln -sfn "$ECOSYSTEM_ROOT/projects/bereketfide/backend/uploads/products" "$UPLOADS_DIR/bereketfide-products"
ln -sfn "$ECOSYSTEM_ROOT/projects/bereketfide/backend/uploads/logo" "$UPLOADS_DIR/bereketfide-logo"

# Vista Seed
ln -sfn "$ECOSYSTEM_ROOT/projects/vistaseed/backend/uploads/products" "$UPLOADS_DIR/vistaseed-products"

echo "✅ Symlinks oluşturuldu:"
ls -la "$UPLOADS_DIR" | grep "^l"
