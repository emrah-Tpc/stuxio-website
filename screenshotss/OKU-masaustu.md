# Masaüstü ekran görüntüleri — güncelleme notu

Sitedeki **masaüstü bölümü yazılı ama kapalı** (`index.html`, "7. MASAÜSTÜ" yorumu).
Açılması için bu klasörde güncel dört dosya olması gerekiyor.

## Gereken dosyalar

| Dosya adı | Hangi ekran |
|---|---|
| `genel_bakis.png` | Panel / Genel Bakış |
| `lessons.png` | Dersler & Alanlar |
| `kronometre.png` | Çalışma Odası (mod seçimi + kronometre) |
| `odak_mode.png` | Odak modu (tam ekran sayaç) |

Aynı adlarla üzerine yaz. Sonra `index.html`'deki yorumu kaldır ve her `<img>`
için gerçek `width`/`height` değerlerini gir (düzen zıplamasın diye).

## ⚠️ Mevcut dosyalar neden kullanılamıyor

5 Eylül 2026'da tek tek açılıp bakıldı:

- `lessons.png`, `kronometre.png`, `kronometre2.png`, `odak_mode.png` → üst barda
  uygulamanın **eski adı "StudyTime"** yazıyor.
- `lessons.png` → Türkçe karakterler bozuk: "i? ve ki?isel geli?im s?re?lerin".
- `genel_bakis.png` → eski düzen: üst menü yok, "Zaman Takibi" (artık "Verimlilik
  Analizi"), "Bekleyen" kartı (artık "Aktif Alan").

Bunları yayınlamak yanlış ürün göstermek olur.

## Çekerken dikkat

- **Tek tema seç.** Site koyu; karışık tema ızgarada dağınık durur.
- **Pencere kaplamalarını dahil etme** — bildirim balonu, Ekran Alıntısı Aracı
  penceresi vb. görüntüde kalmasın.
- **Gerçekçi ama temiz veri**: boş ekran ürünü zayıf gösterir, "Test123" gibi
  adlar da güven vermez.
- Genişlik ~1900px yeterli; mevcut dosyalar da o ölçüde.

## Dokunma

`app-*.png` dosyaları **telefon** görüntüleridir ve GÜNCELDİR (18 Ağu, Stuxio
markası, doğru kart düzeni). Sitede kullanılıyorlar.
