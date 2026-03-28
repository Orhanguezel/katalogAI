#!/bin/bash
# =============================================================
# KatalogAI — Kaynak veritabanı uploads symlink'leri
# Bu script seed sonrası veya ilk kurulumda çalıştırılmalı
# =============================================================

UPLOADS_DIR="$(dirname "$0")/../uploads"
mkdir -p "$UPLOADS_DIR"

# Bereket Fide
ln -sfn /home/orhan/Documents/Projeler/bereketfide/backend/uploads/products "$UPLOADS_DIR/bereketfide-products"
ln -sfn /home/orhan/Documents/Projeler/bereketfide/backend/uploads/logo "$UPLOADS_DIR/bereketfide-logo"

# Vista Seed
ln -sfn /home/orhan/Documents/Projeler/vistaseed/backend/uploads/products "$UPLOADS_DIR/vistaseed-products"

echo "✅ Symlinks oluşturuldu:"
ls -la "$UPLOADS_DIR" | grep "^l"
