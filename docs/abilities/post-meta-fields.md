# Post Meta Fields Ability

Ability for creating or updating the custom field configuration attached to a post type.

---

## `native-custom-fields/save-post-meta-fields`

Creates or updates the meta box and field configuration for a post type. If a configuration already exists for the given `post_type`, it is overwritten.

---

## Input Schema

```json
{
  "type": "object",
  "required": ["post_type", "sections"]
}
```

### Top-level Properties

| Property | Required | Type | Description |
|---|---|---|---|
| `post_type` | Yes | string | Slug of the post type to attach fields to |
| `sections` | Yes | array | Array of meta box definitions |

### Section (Meta Box) Schema

```json
{
  "type": "object",
  "required": ["meta_box_id", "meta_box_title"]
}
```

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `meta_box_id` | Yes | string | — | Unique slug for the meta box |
| `meta_box_title` | Yes | string | — | Meta box title displayed in the admin screen |
| `meta_box_context` | No | string | `"advanced"` | Where the meta box appears: `normal`, `side`, `advanced` |
| `meta_box_priority` | No | string | `"default"` | Meta box priority: `default`, `high`, `core`, `low` |
| `fields` | No | array | `[]` | Fields inside this meta box (see [field-schema.md](field-schema.md)) |

### `meta_box_context` Values

| Value | Description |
|---|---|
| `normal` | Full-width, below the content editor |
| `side` | In the right sidebar |
| `advanced` | Below the normal boxes (default) |

### `meta_box_priority` Values

| Value | Description |
|---|---|
| `default` | Standard ordering (default) |
| `high` | At the top of the context |
| `core` | Sorted with core meta boxes |
| `low` | At the bottom of the context |

---

## Output Schema

```json
{
  "status": true,
  "message": "..."
}
```

| Field | Type | Description |
|---|---|---|
| `status` | boolean | `true` on success, `false` on failure |
| `message` | string | Result description or error message |

---

## Internal Behaviour

- `post_type` is sanitized with `sanitize_key()`.
- `meta_box_id` is sanitized with `sanitize_key()`.
- `meta_box_title` is sanitized with `sanitize_text_field()`.
- Builder slug format: `native_custom_fields_post_meta_fields_builder_{post_type}`
- On success, the same values are also stored via `OptionService::saveOptions()`.
- Field values are stored at runtime in the `wp_postmeta` table using the field `name` as the meta key.

---

## Example

```json
{
  "post_type": "book",
  "sections": [
    {
      "meta_box_id": "book_details",
      "meta_box_title": "Book Details",
      "meta_box_context": "normal",
      "meta_box_priority": "high",
      "fields": [
        {
          "fieldType": "text",
          "name": "author",
          "fieldLabel": "Author",
          "required": true,
          "field_custom_info": {
            "placeholder": "Enter author name"
          }
        },
        {
          "fieldType": "number",
          "name": "page_count",
          "fieldLabel": "Page Count",
          "field_custom_info": {
            "min": 1,
            "max": 9999,
            "step": 1
          }
        },
        {
          "fieldType": "select",
          "name": "language",
          "fieldLabel": "Language",
          "default": "en",
          "field_custom_info": {
            "options": "English:en, German:de, French:fr"
          }
        }
      ]
    },
    {
      "meta_box_id": "book_media",
      "meta_box_title": "Media",
      "meta_box_context": "side",
      "fields": [
        {
          "fieldType": "media_library",
          "name": "cover_image",
          "fieldLabel": "Cover Image"
        }
      ]
    }
  ]
}
```

### Success Response

```json
{
  "status": true,
  "message": "Post meta fields saved successfully."
}
```

### Error Responses

```json
{ "status": false, "message": "post_type is required." }
{ "status": false, "message": "sections is required." }
```

---

## Permission

Requires the `manage_options` WordPress capability.

---

## Related

- [Field Schema](field-schema.md) — Shared schema for field definitions
- [Post Type Abilities](post-type.md) — Creating and updating post types
