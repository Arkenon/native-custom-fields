# Post Meta Fields Ability

Bir post tipine bağlı özel alan konfigürasyonu oluşturmak veya güncellemek için kullanılan ability.

---

## `native-custom-fields/save-post-meta-fields`

Bir post tipine ait meta box'lar ve alanların konfigürasyonunu oluşturur veya günceller.

---

## Input Şeması

```json
{
  "type": "object",
  "required": ["post_type", "sections"]
}
```

### Üst Düzey Alanlar

| Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `post_type` | Evet | string | Alanların ekleneceği post tipi slug'ı |
| `sections` | Evet | array | Meta box tanımları dizisi |

### Section (Meta Box) Şeması

```json
{
  "type": "object",
  "required": ["meta_box_id", "meta_box_title"]
}
```

| Alan | Zorunlu | Tip | Varsayılan | Açıklama |
|---|---|---|---|---|
| `meta_box_id` | Evet | string | — | Meta box için benzersiz slug |
| `meta_box_title` | Evet | string | — | Admin ekranında gösterilen meta box başlığı |
| `meta_box_context` | Hayır | string | `"advanced"` | Meta box'ın konumu: `normal`, `side`, `advanced` |
| `meta_box_priority` | Hayır | string | `"default"` | Meta box önceliği: `default`, `high`, `core`, `low` |
| `fields` | Hayır | array | `[]` | Bu meta box içindeki alanlar (bkz. [field-schema.md](field-schema.md)) |

### `meta_box_context` Değerleri

| Değer | Açıklama |
|---|---|
| `normal` | İçerik editörünün altında, tam genişlikte |
| `side` | Sağ kenar çubuğunda |
| `advanced` | Normal alanların altında (varsayılan) |

### `meta_box_priority` Değerleri

| Değer | Açıklama |
|---|---|
| `default` | Standart sıralama (varsayılan) |
| `high` | Bağlamın en üstünde |
| `core` | Core meta box'larla aynı sıraya alınır |
| `low` | Bağlamın en altında |

---

## Output Şeması

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

- `post_type` → `sanitize_key()` ile temizlenir.
- `meta_box_id` → `sanitize_key()` ile temizlenir.
- `meta_box_title` → `sanitize_text_field()` ile temizlenir.
- Builder slug biçimi: `native_custom_fields_post_meta_fields_builder_{post_type}`
- Kayıt başarılıysa aynı değerler `OptionService::saveOptions()` ile de saklanır.
- Alan değerleri çalışma zamanında `wp_postmeta` tablosunda `{name}` meta key'i ile saklanır.

---

## Örnek

```json
{
  "post_type": "kitap",
  "sections": [
    {
      "meta_box_id": "kitap_detaylari",
      "meta_box_title": "Kitap Detayları",
      "meta_box_context": "normal",
      "meta_box_priority": "high",
      "fields": [
        {
          "fieldType": "text",
          "name": "yazar",
          "fieldLabel": "Yazar",
          "required": true,
          "field_custom_info": {
            "placeholder": "Yazar adını girin"
          }
        },
        {
          "fieldType": "number",
          "name": "sayfa_sayisi",
          "fieldLabel": "Sayfa Sayısı",
          "field_custom_info": {
            "min": 1,
            "max": 9999,
            "step": 1
          }
        },
        {
          "fieldType": "select",
          "name": "dil",
          "fieldLabel": "Dil",
          "default": "tr",
          "field_custom_info": {
            "options": "Türkçe:tr, İngilizce:en, Almanca:de"
          }
        }
      ]
    },
    {
      "meta_box_id": "kitap_gorselleri",
      "meta_box_title": "Görseller",
      "meta_box_context": "side",
      "fields": [
        {
          "fieldType": "media_library",
          "name": "kapak_gorseli",
          "fieldLabel": "Kapak Görseli"
        }
      ]
    }
  ]
}
```

### Başarılı Yanıt

```json
{
  "status": true,
  "message": "Post meta fields saved successfully."
}
```

### Hata Yanıtları

```json
{ "status": false, "message": "post_type is required." }
{ "status": false, "message": "sections is required." }
```

---

## İzin

`manage_options` WordPress yetkisi gerektirir.

---

## İlgili Belgeler

- [Field Schema](field-schema.md) — Alan tanımlarında kullanılan ortak şema
- [Post Type Abilities](post-type.md) — Post tipi oluşturma/güncelleme
