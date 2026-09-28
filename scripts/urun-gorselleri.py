#!/usr/bin/env python3
"""Ana sayfadaki ürün görsellerini screenshotss/ içindeki GERÇEK ekran görüntülerinden üretir.

    python3 scripts/urun-gorselleri.py        (Pillow gerekir: pip install pillow)

Neden kırpma: sayfa ekran görüntüsünü bütün hâlde bir tarayıcı/telefon çerçevesine
koymak yerine anlamlı bölgeyi (halka, takvim, verimli aralık kartı…) gösteriyor.
Tarayıcıda CSS ile kırpmak mümkündü ama 200 KB'lık PNG'nin küçük bir köşesi için
tamamını indirtmek demekti; burada her görsel yalnız gösterilen bölge kadar.

⚠️ Kaynak görsel değişirse bu betiği yeniden çalıştır ve index.html'deki
width/height değerlerini çıktıdaki ölçülerle eşleştir (yoksa sayfa yüklenirken zıplar).
Koordinatlar (sol, üst, sağ, alt) kaynak piksel cinsindendir. """

from pathlib import Path
from PIL import Image

KOK = Path(__file__).resolve().parent.parent
SRC = KOK / "screenshotss"
OUT = KOK / "assets" / "ui"

# ad: (kaynak, kutu, hedef genişlik | None)
KIRPIMLAR = {
    # Hero — masaüstü çalışma odası ve odak modu AYNI kutuyla kırpılır: iki durum
    # arasında geçiş yapılırken öğeler yerinde kalsın.
    "oda-masaustu":   ("kronometre.png",  (330, 88, 1590, 974), 1260),
    "odak-masaustu":  ("odak_mode.png",   (330, 88, 1590, 974), 1260),
    # Hero, dar ekran — telefonun kendi çerçevesi (bezel) dışarıda kalır.
    "oda-telefon":    ("app-odak.png",     (78, 250, 642, 1160), None),
    "odak-telefon":   ("app-odak-tam.png", (78, 250, 642, 1160), None),

    # Sistem zinciri: alan → görev → seans → kayıt
    "zincir-alan":    ("lessons.png",      (530, 286, 946, 490), None),
    "zincir-gorev":   ("gorev_detay.png",  (234, 243, 820, 416), None),
    "zincir-seans":   ("kronometre.png",   (790, 430, 1130, 805), None),
    "zincir-kayit":   ("app-gorevler.png", (100, 650, 620, 1062), None),

    # Odak bandı — sayaç ve ışıması, tam genişlik
    "odak-bant":      ("odak_mode.png",    (0, 200, 1919, 800), 1919),

    # Plan
    "takvim":         ("gorev_takvim.png", (60, 30, 1850, 902), 1600),
    "alanlar":        ("lessons.png",      (70, 100, 1400, 505), 1330),

    # Analiz
    "gecmis":         ("calisma_gecmisi.png", (60, 28, 1850, 631), 1600),
    "verimli-aralik": ("dersaralıgı_verimli_aralıg.png", (968, 0, 1834, 492), None),
    "ders-dagilimi":  ("dersaralıgı_verimli_aralıg.png", (82, 0, 948, 492), None),
    "uzun-gorevler":  ("dersaralıgı_verimli_aralıg.png", (82, 518, 1834, 900), 1600),

    # Masaüstü sekmeleri — tam ekran, yalnız küçültülür
    "m-genel":        ("genel_bakis.png", (0, 0, 1919, 974), 1600),
    "m-dersler":      ("lessons.png",     (0, 0, 1919, 974), 1600),
    "m-oda":          ("kronometre.png",  (0, 0, 1918, 974), 1600),
    "m-odak":         ("odak_mode.png",   (0, 0, 1919, 974), 1600),
}


def kaydet(img, ad):
    yol = OUT / f"{ad}.webp"
    img.save(yol, "WEBP", quality=84, method=6)
    print(f"{ad:16} {img.width}x{img.height}  {yol.stat().st_size // 1024} KB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for ad, (kaynak, kutu, hedef) in KIRPIMLAR.items():
        img = Image.open(SRC / kaynak).convert("RGB").crop(kutu)
        if hedef and img.width > hedef:
            img = img.resize((hedef, round(img.height * hedef / img.width)), Image.LANCZOS)
        kaydet(img, ad)

    # Seans şeridi: kaynaktaki yatay kaydırma çubuğu (beyaz, y≈150–168) ürünün değil
    # ekran görüntüsünün parçası; kareler ve gün numaraları arasından çıkarılıyor.
    s = Image.open(SRC / "seanslar.png").convert("RGB")
    ust = s.crop((86, 88, 1700, 146))
    alt = s.crop((86, 172, 1700, 202))
    serit = Image.new("RGB", (ust.width, ust.height + alt.height + 6), s.getpixel((10, 120)))
    serit.paste(ust, (0, 0))
    serit.paste(alt, (0, ust.height + 6))
    kaydet(serit, "seans-seridi")


if __name__ == "__main__":
    main()
