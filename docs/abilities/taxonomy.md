# Taxonomy Abilities

Abilities for creating and updating custom taxonomies.

---

## `native-custom-fields/create-taxonomy`

Creates a new custom taxonomy and saves its configuration.

## `native-custom-fields/update-taxonomy`

Updates the configuration of an existing custom taxonomy.

> Both abilities share the same `execute_callback` (`saveTaxonomy`) and the same input schema. If the `taxonomy` slug already exists, the record is updated; otherwise a new one is created.

---

## Input Schema

```json
{
  "type": "object",
  "required": ["taxonomy", "label", "object_type"]
}
```

### Properties

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `taxonomy` | Yes | string | — | Taxonomy slug (lowercase, max 32 chars) |
| `label` | Yes | string | — | Plural label (e.g. `"Genres"`) |
| `object_type` | Yes | string[] | — | Post type slugs to attach this taxonomy to (e.g. `["post", "book"]`) |
| `singular_name` | No | string | `label` value | Singular label (e.g. `"Genre"`) |
| `description` | No | string | `""` | Description of the taxonomy |
| `public` | No | boolean | `true` | Whether the taxonomy is publicly accessible |
| `hierarchical` | No | boolean | `true` | `true` for category-like (hierarchical), `false` for tag-like (flat) |
| `show_admin_column` | No | boolean | `false` | Whether to show a taxonomy column on the post type list screen |
| `show_in_rest` | No | boolean | `true` | Whether to expose the taxonomy in the WordPress REST API |

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
- Each value in the `object_type` array is sanitized with `sanitize_key()`.
- Builder slug format: `native_custom_fields_taxonomy_builder_{taxonomy}`
- On success, the same values are also stored via `OptionService::saveOptions()`.
- Label strings (`add_new_item`, `all_items`, `search_items`, etc.) are automatically generated from `label` and `singular_name`.

### Auto-generated Visibility Settings

```
publicly_queryable:  true
show_ui:             true
show_in_menu:        true
show_tagcloud:       true
show_in_quick_edit:  true
show_in_nav_menus:   true
```

### Auto-generated Permalink Settings

```
slug:         {taxonomy}
with_front:   true
hierarchical: {input.hierarchical}
ep_mask:      EP_NONE
```

---

## Examples

### Minimal

```json
{
  "taxonomy": "genre",
  "label": "Genres",
  "object_type": ["book"]
}
```

### Full

```json
{
  "taxonomy": "genre",
  "label": "Genres",
  "singular_name": "Genre",
  "object_type": ["book", "post"],
  "description": "Taxonomy for book genres",
  "public": true,
  "hierarchical": true,
  "show_admin_column": true,
  "show_in_rest": true
}
```

### Success Response

```json
{
  "status": true,
  "message": "Taxonomy saved successfully."
}
```

### Error Responses

```json
{ "status": false, "message": "taxonomy is required." }
{ "status": false, "message": "label is required." }
{ "status": false, "message": "object_type is required." }
```

---

## Permission

Requires the `manage_options` WordPress capability.
