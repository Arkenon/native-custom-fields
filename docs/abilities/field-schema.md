# Alan Şeması (Field Schema)

`AbilityFieldAdapterTrait` tarafından sağlanan bu şema, alan içeren tüm ability'lerde (`save-post-meta-fields`, `save-term-meta-fields`, `save-user-meta-fields`, `save-options-page-fields`) ortak olarak kullanılır.

## Şema

```json
{
  "type": "object",
  "required": ["fieldType", "name", "fieldLabel"],
  "properties": {
    "fieldType":        { "type": "string" },
    "name":             { "type": "string" },
    "fieldLabel":       { "type": "string" },
    "default":          { "type": "string" },
    "required":         { "type": "boolean", "default": false },
    "disabled":         { "type": "boolean", "default": false },
    "field_custom_info": { "type": "object" }
  }
}
```

## Alanlar

| Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `fieldType` | Evet | string | Alan tipi. Desteklenen değerlere bakın. |
| `name` | Evet | string | Benzersiz meta key slug'ı (`sanitize_key` uygulanır) |
| `fieldLabel` | Evet | string | Admin arayüzünde gösterilen etiket |
| `default` | Hayır | string | Varsayılan değer |
| `required` | Hayır | boolean | Alanı zorunlu yapar (varsayılan: `false`) |
| `disabled` | Hayır | boolean | Alanı devre dışı bırakır (varsayılan: `false`) |
| `field_custom_info` | Hayır | object | Alan tipine özgü seçenekler |

## Desteklenen Alan Tipleri (`fieldType`)

| Tip | Açıklama |
|---|---|
| `text` | Tek satırlı metin girişi |
| `textarea` | Çok satırlı metin girişi |
| `input` | HTML input (tip belirtilebilir) |
| `number` | Sayı girişi |
| `range` | Aralık kaydırıcı |
| `select` | Açılır liste |
| `radio` | Radyo butonları |
| `checkbox` | Onay kutusu |
| `toggle` | Açma/kapatma düğmesi |
| `toggle_group` | Grup halinde toggle butonları |
| `combobox` | Arama destekli seçim kutusu |
| `token_field` | Etiket/token girişi |
| `date_picker` | Tarih seçici |
| `date_time_picker` | Tarih ve saat seçici |
| `time_picker` | Saat seçici |
| `file_upload` | Dosya yükleme |
| `media_library` | WordPress medya kütüphanesi seçici |
| `color_picker` | Renk seçici |
| `color_palette` | Renk paleti seçici |
| `font_size` | Yazı boyutu girişi |
| `unit` | Birim girişi |
| `repeater` | Tekrarlayan alan grubu\* |
| `group` | Alan grubu\* |
| `section` | Bölüm başlığı |

> \* `repeater` ve `group` içindeki iç içe alanlar ability aracılığıyla tanımlanamaz.

## `field_custom_info` Seçenekleri

### `select`, `radio`, `combobox`, `token_field`, `toggle_group`

```json
{
  "options": "Etiket:değer, Etiket2:değer2",
  "multiple": false
}
```

### `input`

```json
{
  "type": "text|email|url|number|date|datetime-local|password",
  "placeholder": "...",
  "min": 0,
  "max": 100,
  "step": 1
}
```

### `textarea`

```json
{
  "placeholder": "...",
  "rows": 4
}
```

### `text`

```json
{
  "placeholder": "..."
}
```

### `number`, `range`

```json
{
  "min": 0,
  "max": 100,
  "step": 1
}
```

## Örnek Alan Tanımı

```json
{
  "fieldType": "select",
  "name": "renk_secimi",
  "fieldLabel": "Renk Seçimi",
  "default": "mavi",
  "required": true,
  "field_custom_info": {
    "options": "Kırmızı:kirmizi, Mavi:mavi, Yeşil:yesil"
  }
}
```
