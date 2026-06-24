# Post Type Abilities

Özel post tipleri oluşturmak ve güncellemek için kullanılan ability'ler.

---

## `native-custom-fields/create-post-type`

Yeni bir özel post tipi oluşturur ve konfigürasyonunu kaydeder.

## `native-custom-fields/update-post-type`

Mevcut bir özel post tipinin konfigürasyonunu günceller.

> Her iki ability aynı `execute_callback`'i (`savePostType`) ve aynı input şemasını kullanır. `post_type` slug'ı zaten mevcutsa kayıt güncellenir, yoksa yeni oluşturulur.

---

## Input Şeması

```json
{
  "type": "object",
  "required": ["post_type", "label"]
}
```

### Alanlar

| Alan | Zorunlu | Tip | Varsayılan | Açıklama |
|---|---|---|---|---|
| `post_type` | Evet | string | — | Post tipi slug'ı (küçük harf, max 20 karakter, alt çizgi desteklenir) |
| `label` | Evet | string | — | Çoğul etiket (ör. "Ürünler") |
| `singular_name` | Hayır | string | `label` değeri | Tekil etiket (ör. "Ürün") |
| `description` | Hayır | string | `""` | Post tipini açıklayan metin |
| `menu_position` | Hayır | integer | `null` | Admin menüsündeki sıra konumu |
| `menu_icon` | Hayır | string | `""` | Dashicons sınıfı veya URL (ör. `dashicons-book`) |
| `has_archive` | Hayır | boolean | `false` | Arşiv sayfası oluşturulsun mu? |
| `supports` | Hayır | string[] | `["title","editor","excerpt","comments","author","thumbnail","custom-fields"]` | Post tipinin desteklediği WordPress özellikleri |
| `taxonomies` | Hayır | string[] | `[]` | Post tipine bağlanacak taksonomi slug'ları |
| `public` | Hayır | boolean | `true` | Post tipi genel erişilebilir mi? |
| `hierarchical` | Hayır | boolean | `false` | Sayfa gibi hiyerarşik yapı kullanılsın mı? |
| `show_in_rest` | Hayır | boolean | `true` | WordPress REST API'de görünsün mü? |
| `map_meta_cap` | Hayır | boolean | `true` | Dahili meta yetenek yönetimi kullanılsın mı? |

### `supports` için Geçerli Değerler

`title`, `editor`, `excerpt`, `comments`, `author`, `thumbnail`, `custom-fields`, `revisions`, `page-attributes`, `post-formats`, `trackbacks`

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
- `supports` dizisi verilmezse varsayılan liste kullanılır.
- `taxonomies` dizisindeki her değer `sanitize_key()` ile temizlenir.
- Builder slug biçimi: `native_custom_fields_post_type_builder_{post_type}`
- Kayıt başarılıysa aynı değerler `OptionService::saveOptions()` ile de saklanır.
- Etiket çevirileri (add_new_item, edit_item vb.) otomatik olarak `label` ve `singular_name`'den üretilir.

### Otomatik Oluşturulan Görünürlük Ayarları

```
publicly_queryable: true
show_ui:            true
show_in_menu:       true
show_in_admin_bar:  true
show_in_nav_menus:  true
```

### Otomatik Oluşturulan Permalink Ayarları

```
slug:       {post_type}
with_front: true
feeds:      false
pages:      true
```

---

## Örnekler

### Minimal

```json
{
  "post_type": "kitap",
  "label": "Kitaplar"
}
```

### Detaylı

```json
{
  "post_type": "kitap",
  "label": "Kitaplar",
  "singular_name": "Kitap",
  "description": "Kütüphane katalogu için kitap kayıtları",
  "menu_position": 25,
  "menu_icon": "dashicons-book-alt",
  "has_archive": true,
  "public": true,
  "hierarchical": false,
  "show_in_rest": true,
  "supports": ["title", "editor", "thumbnail", "excerpt", "custom-fields"],
  "taxonomies": ["category", "post_tag"]
}
```

### Başarılı Yanıt

```json
{
  "status": true,
  "message": "Post type saved successfully."
}
```

### Hata Yanıtı

```json
{
  "status": false,
  "message": "post_type is required."
}
```

---

## İzin

`manage_options` WordPress yetkisi gerektirir.
