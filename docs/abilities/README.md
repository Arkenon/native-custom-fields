# NCF Abilities

Native Custom Fields uses the WordPress Abilities API to allow AI tools (MCP-compatible clients, REST API) to programmatically execute plugin operations. All abilities are registered under the `native-custom-fields` category and require the `manage_options` capability.

## Ability List

| Ability Name | Description |
|---|---|
| [native-custom-fields/create-post-type](post-type.md) | Creates a new custom post type |
| [native-custom-fields/update-post-type](post-type.md) | Updates an existing custom post type |
| [native-custom-fields/create-taxonomy](taxonomy.md) | Creates a new custom taxonomy |
| [native-custom-fields/update-taxonomy](taxonomy.md) | Updates an existing custom taxonomy |
| [native-custom-fields/save-post-meta-fields](post-meta-fields.md) | Creates or updates the field configuration for a post type |
| [native-custom-fields/save-term-meta-fields](term-meta-fields.md) | Creates or updates the field configuration for a taxonomy |
| [native-custom-fields/save-user-meta-fields](user-meta-fields.md) | Creates or updates the field configuration shown on user profile pages |
| [native-custom-fields/create-options-page](options-page.md) | Creates a new admin options page |
| [native-custom-fields/update-options-page](options-page.md) | Updates an existing admin options page |
| [native-custom-fields/save-options-page-fields](options-page.md) | Creates or updates the field configuration for an options page |
| [native-custom-fields/list-post-types](post-type.md) | Lists the custom post types stored in NCF configuration (read-only) |
| [native-custom-fields/get-post-type](post-type.md) | Reads one custom post type in the `update-post-type` input shape (read-only) |
| [native-custom-fields/list-taxonomies](taxonomy.md) | Lists the custom taxonomies stored in NCF configuration (read-only) |
| [native-custom-fields/get-taxonomy](taxonomy.md) | Reads one custom taxonomy in the `update-taxonomy` input shape (read-only) |
| [native-custom-fields/list-post-meta-fields](post-meta-fields.md) | Lists the post types that have a field configuration (read-only) |
| [native-custom-fields/get-post-meta-fields](post-meta-fields.md) | Reads the field configuration of a post type (read-only) |
| [native-custom-fields/list-term-meta-fields](term-meta-fields.md) | Lists the taxonomies that have a field configuration (read-only) |
| [native-custom-fields/get-term-meta-fields](term-meta-fields.md) | Reads the field configuration of a taxonomy (read-only) |
| [native-custom-fields/get-user-meta-fields](user-meta-fields.md) | Reads the field configuration shown on user profile pages (read-only) |
| [native-custom-fields/list-options-pages](options-page.md) | Lists the options pages stored in NCF configuration (read-only) |
| [native-custom-fields/get-options-page](options-page.md) | Reads one options page with its sections and fields (read-only) |

## Common Properties

- **Permission:** All abilities require the `manage_options` WordPress capability.
- **MCP:** All abilities are marked `mcp.public: true` and are accessible to MCP-compatible clients.
- **REST:** All abilities are registered with `show_in_rest: true`.
- **Idempotent:** All abilities are idempotent; running them again with the same input updates the existing record.
- **Destructive:** No ability performs destructive operations (no deletions).
- **Read-only:** The `list-*` and `get-*` abilities are marked `readonly` and never modify data.

## Common Output Schema

Every create/update/save ability returns the same output shape (the read-only abilities add their own keys, see below):

```json
{
  "status": true,
  "message": "Operation completed successfully."
}
```

| Field | Type | Description |
|---|---|---|
| `status` | boolean | `true` on success, `false` on failure |
| `message` | string | Human-readable result or error message |

## Read-only Abilities (list / get)

Use them to inspect the current configuration before changing it, for example when repairing a broken configuration.

- `list-*` abilities take no input and return `{ "status": true, "<collection>": [...] }`.
- `get-*` abilities take the slug of the item and return `{ "status": true, ... }`, or `{ "status": false, "message": "... not found." }`.
- Fields and sections are returned in the **same shape the `save-*-fields` abilities accept**, so a result can be edited and sent back.
- Every `get-*` result contains a `builder_state` object that reports whether the builder UI state (the data the Edit / Fields screens in the admin load) exists. If it is `false` while the configuration itself exists, the item works at runtime but looks empty in the builder. Re-saving it with the matching `update-*` / `save-*` ability recreates the builder state.
- Field-level `dependencies` are not returned, because the save abilities do not accept them.

## Field Schema (Shared)

For the shared field definition schema used across field-bearing abilities, see [field-schema.md](field-schema.md).
