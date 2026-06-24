# Taxonomy Abilities

Özel taksonomi oluşturmak ve güncellemek için kullanılan ability'ler.

---

## `native-custom-fields/create-taxonomy`

Yeni bir özel taksonomi oluşturur ve konfigürasyonunu kaydeder.

## `native-custom-fields/update-taxonomy`

Mevcut bir özel taksonominin konfigürasyonunu günceller.

> Her iki ability aynı `execute_callback`'i (`saveTaxonomy`) ve aynı input şemasını kullanır. `taxonomy` slug'ı zaten mevcutsa kayıt güncellenir, yoksa yeni oluşturulur.

---

## Input Şeması

```json
{
  "type": "object",
  "required": ["taxonomy", "label", "object_type"]
}
```

### Alanlar

| Alan | Zorunlu | Tip | Varsayılan | Açıklama |
|---|---|---|---|---|
| `taxonomy` | Evet | string | — | Taksonomi slug'ı (küçük harf, max 32 karakter) |
| `label` | Evet | string | — | Çoğul etiket (ör. "Türler") |
| `object_type` | Evet | string[] | — | Taksonominin bağlanacağı post tipi slug'ları (ör. `["post","kitap"]`) |
| `singular_name` | Hayır | string | `label` değeri | Tekil etiket (ör. "Tür") |
| `description` | Hayır | string | `""` | Taksonomiyi açıklayan metin |
| `public` | Hayır | boolean | `true` | Taksonomi genel erişilebilir mi? |
| `hierarchical` | Hayır | boolean | `true` | Kategori gibi hiyerarşik mi, yoksa etiket gibi düz mü? |
| `show_admin_column` | Hayır | boolean | `false` | Post listesi ekranında taksonomi kolonu gösterilsin mi? |
| `show_in_rest` | Hayır | boolean | `true` | WordPress REST API'de görünsün mü? |

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
- `object_type` dizisindeki her değer `sanitize_key()` ile temizlenir.
- Builder slug biçimi: `native_custom_fields_taxonomy_builder_{taxonomy}`
- Kayıt başarılıysa aynı değerler `OptionService::saveOptions()` ile de saklanır.
- Etiket çevirileri (add_new_item, all_items, search_items vb.) otomatik olarak `label` ve `singular_name`'den üretilir.

### Otomatik Oluşturulan Görünürlük Ayarları

```
publicly_queryable:  true
show_ui:             true
show_in_menu:        true
show_tagcloud:       true
show_in_quick_edit:  true
show_in_nav_menus:   true
```

### Otomatik Oluşturulan Permalink Ayarları

```
slug:         {taxonomy}
with_front:   true
hierarchical: {input.hierarchical}
ep_mask:      EP_NONE
```

---

## Örnekler

### Minimal

```json
{
  "taxonomy": "tur",
  "label": "Türler",
  "object_type": ["kitap"]
}
```

### Detaylı

```json
{
  "taxonomy": "tur",
  "label": "Türler",
  "singular_name": "Tür",
  "object_type": ["kitap", "post"],
  "description": "Kitap türleri için taksonomi",
  "public": true,
  "hierarchical": true,
  "show_admin_column": true,
  "show_in_rest": true
}
```

### Başarılı Yanıt

```json
{
  "status": true,
  "message": "Taxonomy saved successfully."
}
```

### Hata Yanıtları

```json
{ "status": false, "message": "taxonomy is required." }
{ "status": false, "message": "label is required." }
{ "status": false, "message": "object_type is required." }
```

---

## İzin

`manage_options` WordPress yetkisi gerektirir.
