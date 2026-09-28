# Masaüstü ekran görüntüleri

Site bu klasördeki görselleri **doğrudan kullanmaz**. `scripts/urun-gorselleri.py`
buradan kırpılmış/küçültülmüş WebP'ler üretir (`assets/ui/`); sayfa onları gösterir.
Bir görseli yenilediğinde betiği yeniden çalıştır:

    python3 scripts/urun-gorselleri.py

Masaüstü bölümünün (`index.html`, "05 Masaüstü") sekmeleri şu dört dosyadan gelir:

| Dosya | Ekran | Ölçü |
|---|---|---|
| `genel_bakis.png` | Panel / Genel Bakış | 1919×974 |
| `lessons.png` | Dersler & Alanlar | 1919×976 |
| `kronometre.png` | Çalışma Odası | 1918×974 |
| `odak_mode.png` | Odak modu | 1919×986 |

**Güncel sürüm: 23 Ağustos 2026**, Windows uygulamasından.

## ⚠️ Yenilerken

- **Betikteki kırpma kutularını kontrol et.** Kaynağın ölçüsü ya da düzeni
  değişirse kutu yanlış bölgeyi keser. Hero'daki numaralı işaretçilerin konumu
  (`--x`/`--y`) da kırpıma göre verildi.
- **`index.html`'deki `width`/`height` değerlerini betiğin çıktısıyla eşleştir.**
  Yanlış değer görsel yüklenirken sayfayı zıplatır (CLS).
- **Tek tema seç** — dördü de koyu. Karışık tema ızgarada dağınık durur.
- **Pencere kaplamalarını dahil etme**: bildirim balonu, Ekran Alıntısı Aracı
  penceresi, açık bildirim paneli vb.
- **Gerçekçi ama temiz veri.** Boş ekran ürünü zayıf gösterir; "Test123" gibi
  adlar güven vermez.

## Geçmiş

2 Ağustos 2026 tarihli ilk masaüstü görselleri **eski marka dönemine aitti** —
üst barda "StudyTime" yazıyordu, `lessons.png`'de Türkçe karakterler bozuktu ve
`genel_bakis.png` artık var olmayan bir düzeni ("Zaman Takibi", "Bekleyen" kartı)
gösteriyordu. 5 Eylül 2026'da hepsi güncelleriyle değiştirildi; kullanılmayan
`kronometre2.png` kaldırıldı. Eski dosyalar git geçmişinde duruyor.

## Dokunma

`app-*.png` dosyaları **telefon** görüntüleridir (18 Ağu) ve günceldir.
