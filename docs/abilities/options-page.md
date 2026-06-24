# Options Page Abilities

Admin menüsüne özel seçenekler sayfası oluşturmak, güncellemek ve bu sayfaya özel alanlar eklemek için kullanılan ability'ler.

---

## Ability'ler

| Ability | Açıklama |
|---|---|
| `native-custom-fields/create-options-page` | Yeni bir admin options sayfası oluşturur |
| `native-custom-fields/update-options-page` | Mevcut bir options sayfasının konfigürasyonunu günceller |
| `native-custom-fields/save-options-page-fields` | Bir options sayfasına bölümler ve özel alanlar ekler |

---

## `create-options-page` / `update-options-page`

Her iki ability aynı `execute_callback`'i (`saveOptionsPage`) ve aynı input şemasını kullanır. `menu_slug` zaten mevcutsa kayıt güncellenir.

### Input Şeması

```json
{
  "type": "object",
  "required": ["menu_slug", "page_title"]
}
```

#### Alanlar

| Alan | Zorunlu | Tip | Varsayılan | Açıklama |
|---|---|---|---|---|
| `menu_slug` | Evet | string | — | Options sayfası için benzersiz slug (`sanitize_key` uygulanır) |
| `page_title` | Evet | string | — | Tarayıcı/sayfa başlığı |
| `menu_title` | Hayır | string | `page_title` değeri | Admin kenar çubuğunda gösterilen menü etiketi |
| `layout` | Hayır | string | `"stacked"` | Sayfa düzeni: `stacked`, `navigation`, `tab_panel` |
| `icon_url` | Hayır | string | `"dashicons-admin-generic"` | Menü ikonu (Dashicons sınıfı veya URL) |
| `position` | Hayır | integer | `60` | Admin menüsündeki sıra konumu |

#### `layout` Değerleri

| Değer | Açıklama |
|---|---|
| `stacked` | Bölümler dikey olarak alt alta sıralanır |
| `navigation` | Sol tarafta navigasyon menüsü ile bölümler |
| `tab_panel` | Bölümler sekme (tab) şeklinde gösterilir |

### Örnekler

#### Minimal

```json
{
  "menu_slug": "site-ayarlari",
  "page_title": "Site Ayarları"
}
```

#### Detaylı

```json
{
  "menu_slug": "site-ayarlari",
  "page_title": "Site Ayarları",
  "menu_title": "Ayarlar",
  "layout": "tab_panel",
  "icon_url": "dashicons-admin-settings",
  "position": 80
}
```

---

## `save-options-page-fields`

Bir options sayfasına bölümler ve özel alanlar ekler veya günceller.

### Input Şeması

```json
{
  "type": "object",
  "required": ["menu_slug", "sections"]
}
```

#### Üst Düzey Alanlar

| Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `menu_slug` | Evet | string | Alanların ekleneceği options sayfasının slug'ı |
| `sections` | Evet | array | Bölüm tanımları dizisi |

#### Section Şeması

```json
{
  "type": "object",
  "required": ["section_name", "section_title"]
}
```

| Alan | Zorunlu | Tip | Varsayılan | Açıklama |
|---|---|---|---|---|
| `section_name` | Evet | string | — | Bölüm için benzersiz slug |
| `section_title` | Evet | string | — | Admin ekranında gösterilen bölüm başlığı |
| `section_icon` | Hayır | string | `"admin-generic"` | Dashicon adı (ön ek olmadan) |
| `fields` | Hayır | array | `[]` | Bu bölümdeki alanlar (bkz. [field-schema.md](field-schema.md)) |

> `name` alanı `save-options-page-fields` için bir **option key** (seçenek anahtarı) olarak kullanılır; post meta'daki gibi meta key değil.

---

## Output Şeması (Tüm Ability'ler)

```json
{
  "status": true,
  "message": "..."
}
```

| Alan | Tip | Açıklama |
|---|---|---|
| `status` | boolean | `true` başarı, `false` hata |
| `message` | string | İşlem sonucu veya hata mesajı |

---

## Dahili Davranış

- `menu_slug` → `sanitize_key()` ile temizlenir.
- **create/update** için builder slug: `native_custom_fields_options_page_builder_{menu_slug}`
- **save-fields** için builder slug: `native_custom_fields_options_page_fields_builder_{menu_slug}`
- Kayıt başarılıysa `OptionService::saveOptions()` ile de saklanır.
- Options sayfası değerleri çalışma zamanında `wp_options` tablosunda tek bir serialized kayıt olarak saklanır.

---

## Tam Örnek (İki Adımlı Kurulum)

### Adım 1 — Sayfayı Oluştur

```json
{
  "menu_slug": "sirket-ayarlari",
  "page_title": "Şirket Ayarları",
  "menu_title": "Şirket",
  "layout": "navigation",
  "icon_url": "dashicons-building",
  "position": 75
}
```

### Adım 2 — Alanları Kaydet

```json
{
  "menu_slug": "sirket-ayarlari",
  "sections": [
    {
      "section_name": "genel",
      "section_title": "Genel Bilgiler",
      "section_icon": "admin-home",
      "fields": [
        {
          "fieldType": "text",
          "name": "sirket_adi",
          "fieldLabel": "Şirket Adı",
          "required": true
        },
        {
          "fieldType": "input",
          "name": "sirket_web_sitesi",
          "fieldLabel": "Web Sitesi",
          "field_custom_info": {
            "type": "url",
            "placeholder": "https://..."
          }
        },
        {
          "fieldType": "media_library",
          "name": "sirket_logosu",
          "fieldLabel": "Şirket Logosu"
        }
      ]
    },
    {
      "section_name": "iletisim",
      "section_title": "İletişim Bilgileri",
      "section_icon": "email",
      "fields": [
        {
          "fieldType": "input",
          "name": "iletisim_email",
          "fieldLabel": "İletişim E-postası",
          "field_custom_info": {
            "type": "email"
          }
        },
        {
          "fieldType": "text",
          "name": "iletisim_telefon",
          "fieldLabel": "Telefon"
        },
        {
          "fieldType": "textarea",
          "name": "adres",
          "fieldLabel": "Adres",
          "field_custom_info": {
            "rows": 3
          }
        }
      ]
    }
  ]
}
```

### Başarılı Yanıtlar

```json
{ "status": true, "message": "Options page saved successfully." }
{ "status": true, "message": "Options page fields saved successfully." }
```

### Hata Yanıtları

```json
{ "status": false, "message": "menu_slug is required." }
{ "status": false, "message": "page_title is required." }
{ "status": false, "message": "sections is required." }
```

---

## Verilere Erişim

Options sayfasına kaydedilen değerler `wp_options` tablosunda `menu_slug` ile tek bir kayıt olarak saklanır:

```php
// Tüm options sayfası verilerini al
$ayarlar = get_option( 'sirket-ayarlari' );

// Belirli bir değere eriş
$sirket_adi = $ayarlar['sirket_adi'] ?? '';
$logo_id    = $ayarlar['sirket_logosu'] ?? '';
```

---

## İzin

`manage_options` WordPress yetkisi gerektirir.

---

## İlgili Belgeler

- [Field Schema](field-schema.md) — Alan tanımlarında kullanılan ortak şema
