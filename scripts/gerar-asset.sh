#!/usr/bin/env bash
# Gera um asset da Hotmart a partir de um HTML no tamanho exato, com verificação.
#
# Uso:
#   bash scripts/gerar-asset.sh <arquivo.html> <saida.png> <LARGURAxALTURA>
#
# Exemplos:
#   bash scripts/gerar-asset.sh templates/capa-600.html capa.png 600x600
#   bash scripts/gerar-asset.sh templates/header-club-2700x900.html header.png 2700x900
set -euo pipefail

HTML="${1:?uso: gerar-asset.sh arquivo.html saida.png LARGURAxALTURA}"
SAIDA="${2:?informe o arquivo de saída .png}"
TAM="${3:?informe o tamanho, ex: 600x600}"
W="${TAM%x*}"; H="${TAM#*x}"

# Chrome em macOS ou Linux
CHROME=""
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)" \
  "$(command -v chromium-browser || true)"; do
  [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
done
[ -n "$CHROME" ] || { echo "✗ Chrome/Chromium não encontrado"; exit 1; }

ABS="$(cd "$(dirname "$HTML")" && pwd)/$(basename "$HTML")"

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size="$W","$H" --virtual-time-budget=6000 \
  --screenshot="$SAIDA" "file://$ABS" 2>/dev/null

# valida dimensões (sips no mac; python como fallback)
if command -v sips >/dev/null 2>&1; then
  GOT_W=$(sips -g pixelWidth  "$SAIDA" | awk '/pixelWidth/{print $2}')
  GOT_H=$(sips -g pixelHeight "$SAIDA" | awk '/pixelHeight/{print $2}')
else
  read -r GOT_W GOT_H < <(python3 -c "import struct,sys
f=open('$SAIDA','rb');f.read(16);w,h=struct.unpack('>II',f.read(8));print(w,h)")
fi
[ "$GOT_W" = "$W" ] && [ "$GOT_H" = "$H" ] \
  && echo "✓ $SAIDA gerado em ${GOT_W}x${GOT_H} ($(du -h "$SAIDA" | cut -f1 | tr -d ' '))" \
  || { echo "✗ saiu ${GOT_W}x${GOT_H}, esperado ${W}x${H}"; exit 1; }

# capa da Hotmart tem limite de 5MB
BYTES=$(wc -c < "$SAIDA" | tr -d ' ')
[ "$BYTES" -lt 5242880 ] || echo "⚠ arquivo acima de 5MB — a Hotmart recusa a capa; exporte JPG ou simplifique o fundo"
