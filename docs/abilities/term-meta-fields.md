# Term Meta Fields Ability

Bir taksonomiye bağlı özel alan konfigürasyonu oluşturmak veya güncellemek için kullanılan ability.

---

## `native-custom-fields/save-term-meta-fields`

Bir taksonomiyle ilişkili terimlerin (term) düzenleme sayfasında gösterilecek özel alan konfigürasyonunu oluşturur veya günceller.

---

## Input Şeması

```json
{
  "type": "object",
  "required": ["taxonomy", "sections"]
}
```

### Üst Düzey Alanlar

| Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `taxonomy` | Evet | string | Alanların ekleneceği taksonomi slug'ı |
| `sections` | Evet | array | Bölüm tanımları dizisi |

### Section Şeması

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
| `section_icon` | Hayır | string | `"admin-generic"` | Dashicon adı (ön ek olmadan, ör. `"tag"`) |
| `fields` | Hayır | array | `[]` | Bu bölümdeki alanlar (bkz. [field-schema.md](field-schema.md)) |

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

- `taxonomy` → `sanitize_key()` ile temizlenir.
- `section_name` → `sanitize_key()` ile temizlenir.
- `section_title` → `sanitize_text_field()` ile temizlenir.
- Builder slug biçimi: `native_custom_fields_term_meta_fields_builder_{taxonomy}`
- Kayıt başarılıysa aynı değerler `OptionService::saveOptions()` ile de saklanır.
- Alan değerleri çalışma zamanında `wp_termmeta` tablosunda `{name}` meta key'i ile saklanır.
- Bölümler dahili olarak `fieldType: "section"` ile işaretlenerek `TermMetaService::saveTermMetaFieldsConfig()` metoduna iletilir.

---

## Örnek

```json
{
  "taxonomy": "tur",
  "sections": [
    {
      "section_name": "tur_detaylari",
      "section_title": "Tür Detayları",
      "section_icon": "tag",
      "fields": [
        {
          "fieldType": "textarea",
          "name": "tur_aciklamasi",
          "fieldLabel": "Uzun Açıklama",
          "field_custom_info": {
            "rows": 5,
            "placeholder": "Türü detaylıca açıklayın"
          }
        },
        {
          "fieldType": "media_library",
          "name": "tur_gorseli",
          "fieldLabel": "Tür Görseli"
        },
        {
          "fieldType": "color_picker",
          "name": "tur_rengi",
          "fieldLabel": "Tür Rengi",
          "default": "#3498db"
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
  "message": "Term meta fields saved successfully."
}
```

### Hata Yanıtları

```json
{ "status": false, "message": "taxonomy is required." }
{ "status": false, "message": "sections is required." }
```

---

## İzin

`manage_options` WordPress yetkisi gerektirir.

---

## İlgili Belgeler

- [Field Schema](field-schema.md) — Alan tanımlarında kullanılan ortak şema
- [Taxonomy Abilities](taxonomy.md) — Taksonomi oluşturma/güncelleme
