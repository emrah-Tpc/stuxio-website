#!/usr/bin/env bash
# sitemap.xml üretir. Sayfa ekleyip çıkardıkça ELLE düzenlemek yerine bunu çalıştır:
#
#     ./scripts/sitemap-uret.sh
#
# Neden betik: <lastmod> elle tutulduğunda kaçınılmaz olarak kayar — sayfa değişir,
# tarih eski kalır ya da tersi. Google yanlış lastmod gören bir sitemap'e zamanla
# GÜVENMEYİ BIRAKIR; o noktada alan hiç olmamasından kötüdür. Burada tarih git
# geçmişinden okunuyor, yani her zaman dosyanın gerçek son değişikliği.
#
# <priority> ve <changefreq> BİLEREK YOK: Google ikisini de yok saydığını açıkça
# söyledi. Yok sayılan alan tutmak, bakması gereken kişiyi yanıltır.

set -euo pipefail
cd "$(dirname "$0")/.."

SITE="https://stuxio.net"

# dosya:url-yolu  — index.html kök adrese, diğerleri UZANTISIZ adrese karşılık gelir
# (site .html isteğini 307 ile uzantısıza yönlendiriyor; kanonik olan uzantısız hâli).
SAYFALAR=(
  "index.html:/"
  "gizlilik.html:/gizlilik"
  "kullanim-kosullari.html:/kullanim-kosullari"
  "hesap-silme.html:/hesap-silme"
  "destek.html:/destek"
)

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<!-- scripts/sitemap-uret.sh tarafından üretildi — ELLE DÜZENLEME. -->'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for kayit in "${SAYFALAR[@]}"; do
    dosya="${kayit%%:*}"
    yol="${kayit#*:}"

    [ -f "$dosya" ] || { echo "HATA: $dosya yok" >&2; exit 1; }

    # Commit edilmemiş değişiklik varsa git tarihi YANILTIR: dosya diskte değişmiş
    # ama sitemap eski tarihi yazar. Bu durumda bugünü kullan.
    if ! git diff --quiet -- "$dosya" 2>/dev/null || ! git diff --cached --quiet -- "$dosya" 2>/dev/null; then
      tarih="$(date +%F)"
    else
      tarih="$(git log -1 --format=%cs -- "$dosya" 2>/dev/null || date +%F)"
      [ -n "$tarih" ] || tarih="$(date +%F)"
    fi

    printf '  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' \
      "$SITE" "$yol" "$tarih"
  done
  echo '</urlset>'
} > sitemap.xml

echo "sitemap.xml üretildi — $(grep -c '<url>' sitemap.xml) adres"
