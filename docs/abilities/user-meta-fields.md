# User Meta Fields Ability

Kullanıcı profil sayfasına özel alan konfigürasyonu oluşturmak veya güncellemek için kullanılan ability.

---

## `native-custom-fields/save-user-meta-fields`

Tüm kullanıcıların profil/düzenleme sayfasında görüntülenecek özel alan konfigürasyonunu oluşturur veya günceller.

> Bu ability kullanıcı başına değil, **tüm kullanıcılara** uygulanacak global bir konfigürasyon tanımlar.

---

## Input Şeması

```json
{
  "type": "object",
  "required": ["sections"]
}
```

### Üst Düzey Alanlar

| Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `sections` | Evet | array | Kullanıcı profil sayfasında gösterilecek bölüm tanımları |

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
| `section_title` | Evet | string | — | Kullanıcı profil sayfasında gösterilen bölüm başlığı |
| `section_icon` | Hayır | string | `""` | Dashicon adı (ön ek olmadan, ör. `"admin-users"`) |
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

- `section_name` → `sanitize_key()` ile temizlenir.
- `section_title` → `sanitize_text_field()` ile temizlenir.
- Builder slug sabittir: `native_custom_fields_user_meta_fields_builder_all_users`
- Kayıt başarılıysa aynı değerler `OptionService::saveOptions()` ile de saklanır.
- Alan değerleri çalışma zamanında `wp_usermeta` tablosunda `{name}` meta key'i ile saklanır.
- Bölümler dahili olarak `fieldType: "section"` ile işaretlenerek `UserMetaService::saveUserMetaFieldsConfig()` metoduna iletilir.

---

## Örnek

```json
{
  "sections": [
    {
      "section_name": "kisisel_bilgiler",
      "section_title": "Kişisel Bilgiler",
      "section_icon": "admin-users",
      "fields": [
        {
          "fieldType": "text",
          "name": "unvan",
          "fieldLabel": "Unvan",
          "field_custom_info": {
            "placeholder": "Dr., Prof., vb."
          }
        },
        {
          "fieldType": "text",
          "name": "telefon",
          "fieldLabel": "Telefon Numarası"
        },
        {
          "fieldType": "select",
          "name": "departman",
          "fieldLabel": "Departman",
          "field_custom_info": {
            "options": "Yazılım:yazilim, Tasarım:tasarim, Pazarlama:pazarlama, İK:ik"
          }
        }
      ]
    },
    {
      "section_name": "sosyal_medya",
      "section_title": "Sosyal Medya",
      "section_icon": "share",
      "fields": [
        {
          "fieldType": "input",
          "name": "linkedin_url",
          "fieldLabel": "LinkedIn Profili",
          "field_custom_info": {
            "type": "url",
            "placeholder": "https://linkedin.com/in/..."
          }
        },
        {
          "fieldType": "input",
          "name": "github_url",
          "fieldLabel": "GitHub Profili",
          "field_custom_info": {
            "type": "url",
            "placeholder": "https://github.com/..."
          }
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
  "message": "User meta fields saved successfully."
}
```

### Hata Yanıtı

```json
{ "status": false, "message": "sections is required." }
```

---

## Verilere Erişim

Kaydedilen kullanıcı meta verilerine WordPress'in native fonksiyonuyla erişilir:

```php
$unvan = get_user_meta( $user_id, 'unvan', true );
$departman = get_user_meta( $user_id, 'departman', true );
```

---

## İzin

`manage_options` WordPress yetkisi gerektirir.

---

## İlgili Belgeler

- [Field Schema](field-schema.md) — Alan tanımlarında kullanılan ortak şema
