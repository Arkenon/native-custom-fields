# Options Page Abilities

Abilities for creating and updating admin options pages, and for saving custom fields on those pages.

---

## Abilities

| Ability | Description |
|---|---|
| `native-custom-fields/create-options-page` | Creates a new admin options page |
| `native-custom-fields/update-options-page` | Updates an existing admin options page |
| `native-custom-fields/save-options-page-fields` | Creates or updates the field configuration for an options page |

---

## `create-options-page` / `update-options-page`

Both abilities share the same `execute_callback` (`saveOptionsPage`) and the same input schema. If `menu_slug` already exists, the record is updated.

### Input Schema

```json
{
  "type": "object",
  "required": ["menu_slug", "page_title"]
}
```

#### Properties

| Property | Required | Type | Default | Description |
|---|---|---|---|---|
| `menu_slug` | Yes | string | — | Unique slug for the options page (`sanitize_key` is applied) |
| `page_title` | Yes | string | — | Browser/page title |
| `menu_title` | No | string | `page_title` value | Label shown in the admin sidebar |
| `layout` | No | string | `"stacked"` | Page layout: `stacked`, `navigation`, `tab_panel` |
| `icon_url` | No | string | `"dashicons-admin-generic"` | Menu icon — Dashicons class or URL |
| `position` | No | integer | `60` | Admin menu position order |

#### `layout` Values

| Value | Description |
|---|---|
| `stacked` | Sections stacked vertically one below the other |
| `navigation` | Left-side navigation menu with sections |
| `tab_panel` | Sections displayed as tabs |

### Examples

#### Minimal

```json
{
  "menu_slug": "site-settings",
  "page_title": "Site Settings"
}
```

#### Full

```json
{
  "menu_slug": "site-settings",
  "page_title": "Site Settings",
  "menu_title": "Settings",
  "layout": "tab_panel",
  "icon_url": "dashicons-admin-settings",
  "position": 80
}
```

---

## `save-options-page-fields`

Creates or updates sections and custom fields on an options page.

### Input Schema

```json
{
  "type": "object",
  "required": ["menu_slug", "sections"]
}
```

#### Top-level Properties

| Property | Required | Type | Description |
|---|---|---|---|
| `menu_slug` | Yes | string | Slug of the options page to add fields to |
| `sections` | Yes | array | Array of section definitions |

#### Section Schema

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
| `section_icon` | No | string | `"admin-generic"` | Dashicon name without the `dashicons-` prefix |
| `fields` | No | array | `[]` | Fields inside this section (see [field-schema.md](field-schema.md)) |

> The `name` property of each field acts as an **option key** (not a meta key) when used in options pages.

---

## Output Schema (All Abilities)

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

- `menu_slug` is sanitized with `sanitize_key()`.
- **create/update** builder slug: `native_custom_fields_options_page_builder_{menu_slug}`
- **save-fields** builder slug: `native_custom_fields_options_page_fields_builder_{menu_slug}`
- On success, the same values are also stored via `OptionService::saveOptions()`.
- Options page values are stored at runtime in the `wp_options` table as a single serialized record keyed by `menu_slug`.

---

## Full Example (Two-step Setup)

### Step 1 — Create the Page

```json
{
  "menu_slug": "company-settings",
  "page_title": "Company Settings",
  "menu_title": "Company",
  "layout": "navigation",
  "icon_url": "dashicons-building",
  "position": 75
}
```

### Step 2 — Save the Fields

```json
{
  "menu_slug": "company-settings",
  "sections": [
    {
      "section_name": "general",
      "section_title": "General Information",
      "section_icon": "admin-home",
      "fields": [
        {
          "fieldType": "text",
          "name": "company_name",
          "fieldLabel": "Company Name",
          "required": true
        },
        {
          "fieldType": "input",
          "name": "company_website",
          "fieldLabel": "Website",
          "field_custom_info": {
            "type": "url",
            "placeholder": "https://..."
          }
        },
        {
          "fieldType": "media_library",
          "name": "company_logo",
          "fieldLabel": "Company Logo"
        }
      ]
    },
    {
      "section_name": "contact",
      "section_title": "Contact Information",
      "section_icon": "email",
      "fields": [
        {
          "fieldType": "input",
          "name": "contact_email",
          "fieldLabel": "Contact Email",
          "field_custom_info": {
            "type": "email"
          }
        },
        {
          "fieldType": "text",
          "name": "contact_phone",
          "fieldLabel": "Phone"
        },
        {
          "fieldType": "textarea",
          "name": "address",
          "fieldLabel": "Address",
          "field_custom_info": {
            "rows": 3
          }
        }
      ]
    }
  ]
}
```

### Success Responses

```json
{ "status": true, "message": "Options page saved successfully." }
{ "status": true, "message": "Options page fields saved successfully." }
```

### Error Responses

```json
{ "status": false, "message": "menu_slug is required." }
{ "status": false, "message": "page_title is required." }
{ "status": false, "message": "sections is required." }
```

---

## Accessing Saved Data

Options page values are stored in `wp_options` as a single serialized record keyed by `menu_slug`:

```php
// Get all options page data
$settings = get_option( 'company-settings' );

// Access individual values
$company_name = $settings['company_name'] ?? '';
$logo_id      = $settings['company_logo'] ?? '';
```

---

## Permission

Requires the `manage_options` WordPress capability.

---

## Related

- [Field Schema](field-schema.md) — Shared schema for field definitions
