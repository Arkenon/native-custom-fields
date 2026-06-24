# Post Type Abilities

Abilities for creating and updating custom post types.

---

## `native-custom-fields/create-post-type`

Creates a new custom post type and saves its configuration.

## `native-custom-fields/update-post-type`

Updates the configuration of an existing custom post type.

> Both abilities share the same `execute_callback` (`savePostType`) and the same input schema. If the `post_type` slug already exists, the record is updated; otherwise a new one is created.

---

## Input Schema

```json
{
  "type": "object",
  "required": ["post_type", "label"]
}
```

### Properties

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `post_type` | Yes | string | — | Post type slug (lowercase, max 20 chars, underscores allowed) |
| `label` | Yes | string | — | Plural label (e.g. `"Books"`) |
| `singular_name` | No | string | `label` value | Singular label (e.g. `"Book"`) |
| `description` | No | string | `""` | Description of the post type |
| `menu_position` | No | integer | `null` | Admin menu position order |
| `menu_icon` | No | string | `""` | Dashicons class or URL (e.g. `"dashicons-book"`) |
| `has_archive` | No | boolean | `false` | Whether to enable an archive page |
| `supports` | No | string[] | `["title","editor","excerpt","comments","author","thumbnail","custom-fields"]` | WordPress features supported by this post type |
| `taxonomies` | No | string[] | `[]` | Taxonomy slugs to register for this post type |
| `public` | No | boolean | `true` | Whether the post type is publicly accessible |
| `hierarchical` | No | boolean | `false` | Whether the post type is hierarchical (like pages) |
| `show_in_rest` | No | boolean | `true` | Whether to expose the post type in the WordPress REST API |
| `map_meta_cap` | No | boolean | `true` | Whether to use the internal default meta capability handling |

### Valid `supports` Values

`title`, `editor`, `excerpt`, `comments`, `author`, `thumbnail`, `custom-fields`, `revisions`, `page-attributes`, `post-formats`, `trackbacks`

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
- If `supports` is not provided, the default list is used.
- Each value in the `taxonomies` array is sanitized with `sanitize_key()`.
- Builder slug format: `native_custom_fields_post_type_builder_{post_type}`
- On success, the same values are also stored via `OptionService::saveOptions()`.
- Label strings (`add_new_item`, `edit_item`, etc.) are automatically generated from `label` and `singular_name`.

### Auto-generated Visibility Settings

```
publicly_queryable: true
show_ui:            true
show_in_menu:       true
show_in_admin_bar:  true
show_in_nav_menus:  true
```

### Auto-generated Permalink Settings

```
slug:       {post_type}
with_front: true
feeds:      false
pages:      true
```

---

## Examples

### Minimal

```json
{
  "post_type": "book",
  "label": "Books"
}
```

### Full

```json
{
  "post_type": "book",
  "label": "Books",
  "singular_name": "Book",
  "description": "Book records for the library catalogue",
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

### Success Response

```json
{
  "status": true,
  "message": "Post type saved successfully."
}
```

### Error Responses

```json
{ "status": false, "message": "post_type is required." }
{ "status": false, "message": "label is required." }
```

---

## Permission

Requires the `manage_options` WordPress capability.
