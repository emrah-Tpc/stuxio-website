# Mağaza görselleri — App Store

`app-store/<dil>/` altında altı ekran görüntüsü var; üç dilde (tr, en, de), her biri
**1290×2796 PNG, RGB (alfa yok)** — App Store Connect'in 6.9" iPhone boyutu. Apple
daha küçük iPhone boyutlarını bu setten kendisi ölçekler.

| # | Dosya | Konu |
|---|---|---|
| 1 | `01-odak.png` | Odak modu (hero) |
| 2 | `02-modlar.png` | Dört kronometre modu, hepsi ücretsiz |
| 3 | `03-gorevler.png` | Süre göreve işlenir |
| 4 | `04-istatistik.png` | Çalışma geçmişi (30 gün / 3 ay Premium olarak belirtildi) |
| 5 | `05-verimli-aralik.png` | En verimli saatler |
| 6 | `06-cevrimdisi.png` | Çevrimdışı çalışma + reklam/izleme yok, veri AB'de |

App Store Connect'te her dilin kendi sayfasına (Türkçe, English (U.S.), German)
o dilin klasöründeki dosyaları **numara sırasıyla** yükle.

## Yeniden üretmek

    python3 scripts/magaza-ekranlari.py     # telefon ekranlarını çıkarır → ekranlar/
    node scripts/magaza-gorselleri.mjs      # görselleri üretir → app-store/

Metinlerin hepsi `sablon.html` içindeki `METIN` nesnesinde. Görsel dil sitedekiyle
aynı (yazı tipleri de `assets/fonts/`'tan).

## ⚠️ Bilinen sınırlar

- **Uygulama ekranları Türkçe.** `screenshotss/` yalnız Türkçe arayüz içeriyor;
  EN/DE görsellerde başlık ve etiketler çevrildi, telefonun içi Türkçe kaldı.
  (6. görsel ekran içermediği için üç dilde de tamamen yerel.)
- **Çözünürlük.** Kaynak telefon görüntüleri kasalı 720×1379; ekran alanı 568 px.
  1290 px'lik görsele 1.65 kat büyütülüyor, yakından bakınca yumuşak.

İkisinin çözümü aynı: telefondan **kasasız, tam çözünürlüklü** ekran görüntüsü al
(uygulama dili TR, EN ve DE olarak ayrı ayrı), `ekranlar/` altına koy ve
`sablon.html`'deki `DUZEN` eşlemesini dile göre dosya adıyla güncelle. Bu durumda
`magaza-ekranlari.py`'deki kasa kırpması gerekmez.
