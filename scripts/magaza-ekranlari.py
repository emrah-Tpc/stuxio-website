#!/usr/bin/env python3
"""Mağaza görselleri için telefon ekranlarını screenshotss/'daki görüntülerden çıkarır.

    python3 scripts/magaza-ekranlari.py      (Pillow gerekir: pip install pillow)

Kaynak telefon görüntüleri (720×1379) içine gömülü bir iPhone kasasıyla geliyor.
Burada yalnız EKRAN alanı kesilir (kasa ve siyah çerçeve dışarıda kalır); köşe
yuvarlaması şablonda CSS ile yapılır. App Store 1290 px genişlik istediği için ekran
2 kat büyütülür (Lanczos) ve hafifçe keskinleştirilir. Kaynak 568 px genişliğinde:
sonuç yumuşak görünür — en net sonuç için telefondan kasasız, tam çözünürlüklü ekran
görüntüsü alıp buraya aynı adla koymak (bkz. magaza/OKU.md).

⚠️ Ekran kutusu (EKRAN) kasanın iç kenarından 1 px içeride ölçüldü (29 Eyl 2026).
Kaynak görsellerin kasa şablonu değişirse yeniden ölç. """

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

KOK = Path(__file__).resolve().parent.parent
SRC = KOK / "screenshotss"
OUT = KOK / "magaza" / "ekranlar"

EKRAN = (76, 73, 644, 1299)   # sol, üst, sağ, alt — 568×1226
KAYNAKLAR = ["app-odak-tam", "app-odak", "app-gorevler", "app-istatistik", "app-ipucu"]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for ad in KAYNAKLAR:
        img = Image.open(SRC / f"{ad}.png").convert("RGB")
        # Kasa şablonunun çentiği ve kamera noktaları ekranın üstüne biniyor; gerçek
        # bir ekran görüntüsünde bunlar yok. Saat (x≤217) ile simgeler (x≥487)
        # arasındaki bölge ekranın kendi zemin rengiyle örtülür; simgelerin
        # çevresinde kalan çentik parçaları (saf siyah) da aynı renge çekilir.
        zemin = img.getpixel((150, 85))
        ImageDraw.Draw(img).rectangle((222, 73, 482, 132), fill=zemin)
        px = img.load()
        for y in range(73, 136):
            for x in range(196, 530):
                if sum(px[x, y]) < 14:
                    px[x, y] = zemin
        img = img.crop(EKRAN)
        img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
        img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))
        yol = OUT / f"{ad}.png"
        img.save(yol, optimize=True)
        print(f"{ad:16} {img.width}x{img.height}  {yol.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
