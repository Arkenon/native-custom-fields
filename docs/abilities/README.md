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

## Common Properties

- **Permission:** All abilities require the `manage_options` WordPress capability.
- **MCP:** All abilities are marked `mcp.public: true` and are accessible to MCP-compatible clients.
- **REST:** All abilities are registered with `show_in_rest: true`.
- **Idempotent:** All abilities are idempotent; running them again with the same input updates the existing record.
- **Destructive:** No ability performs destructive operations (no deletions).

## Common Output Schema

Every ability returns the same output shape:

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

## Field Schema (Shared)

For the shared field definition schema used across field-bearing abilities, see [field-schema.md](field-schema.md).
