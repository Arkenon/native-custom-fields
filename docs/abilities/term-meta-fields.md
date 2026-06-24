# Term Meta Fields Ability

Ability for creating or updating the custom field configuration attached to a taxonomy.

---

## `native-custom-fields/save-term-meta-fields`

Creates or updates the field configuration displayed on the term edit pages of a given taxonomy. If a configuration already exists for the given `taxonomy`, it is overwritten.

---

## Input Schema

```json
{
  "type": "object",
  "required": ["taxonomy", "sections"]
}
```

### Top-level Properties

| Property | Required | Type | Description |
|---|---|---|---|
| `taxonomy` | Yes | string | Slug of the taxonomy to attach fields to |
| `sections` | Yes | array | Array of section definitions |

### Section Schema

```json
{
  "type": "object",
  "required": ["section_name", "section_title"]
}
```

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `section_name` | Yes | string | — | Unique slug for the section |
| `section_title` | Yes | string | — | Section title displayed in the admin screen |
| `section_icon` | No | string | `"admin-generic"` | Dashicon name without the `dashicons-` prefix (e.g. `"tag"`) |
| `fields` | No | array | `[]` | Fields inside this section (see [field-schema.md](field-schema.md)) |

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

- `taxonomy` is sanitized with `sanitize_key()`.
- `section_name` is sanitized with `sanitize_key()`.
- `section_title` is sanitized with `sanitize_text_field()`.
- Builder slug format: `native_custom_fields_term_meta_fields_builder_{taxonomy}`
- On success, the same values are also stored via `OptionService::saveOptions()`.
- Field values are stored at runtime in the `wp_termmeta` table using the field `name` as the meta key.
- Sections are internally tagged with `fieldType: "section"` before being passed to `TermMetaService::saveTermMetaFieldsConfig()`.

---

## Example

```json
{
  "taxonomy": "genre",
  "sections": [
    {
      "section_name": "genre_details",
      "section_title": "Genre Details",
      "section_icon": "tag",
      "fields": [
        {
          "fieldType": "textarea",
          "name": "long_description",
          "fieldLabel": "Long Description",
          "field_custom_info": {
            "rows": 5,
            "placeholder": "Describe this genre in detail"
          }
        },
        {
          "fieldType": "media_library",
          "name": "genre_image",
          "fieldLabel": "Genre Image"
        },
        {
          "fieldType": "color_picker",
          "name": "genre_color",
          "fieldLabel": "Genre Color",
          "default": "#3498db"
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
  "message": "Term meta fields saved successfully."
}
```

### Error Responses

```json
{ "status": false, "message": "taxonomy is required." }
{ "status": false, "message": "sections is required." }
```

---

## Permission

Requires the `manage_options` WordPress capability.

---

## Related

- [Field Schema](field-schema.md) — Shared schema for field definitions
- [Taxonomy Abilities](taxonomy.md) — Creating and updating taxonomies
