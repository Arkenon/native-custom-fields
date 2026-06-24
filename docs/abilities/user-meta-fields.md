# User Meta Fields Ability

Ability for creating or updating the custom field configuration shown on user profile pages.

---

## `native-custom-fields/save-user-meta-fields`

Creates or updates the custom field configuration displayed on the user profile and edit pages. The configuration applies **globally to all users** — it is not per-user.

---

## Input Schema

```json
{
  "type": "object",
  "required": ["sections"]
}
```

### Top-level Properties

| Property | Required | Type | Description |
|---|---|---|---|
| `sections` | Yes | array | Field sections to display on the user profile/edit page |

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
| `section_title` | Yes | string | — | Section title displayed on the user profile page |
| `section_icon` | No | string | `""` | Dashicon name without the `dashicons-` prefix (e.g. `"admin-users"`) |
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

- `section_name` is sanitized with `sanitize_key()`.
- `section_title` is sanitized with `sanitize_text_field()`.
- Builder slug is fixed: `native_custom_fields_user_meta_fields_builder_all_users`
- On success, the same values are also stored via `OptionService::saveOptions()`.
- Field values are stored at runtime in the `wp_usermeta` table using the field `name` as the meta key.
- Sections are internally tagged with `fieldType: "section"` before being passed to `UserMetaService::saveUserMetaFieldsConfig()`.

---

## Example

```json
{
  "sections": [
    {
      "section_name": "personal_info",
      "section_title": "Personal Information",
      "section_icon": "admin-users",
      "fields": [
        {
          "fieldType": "text",
          "name": "title",
          "fieldLabel": "Title",
          "field_custom_info": {
            "placeholder": "Dr., Prof., etc."
          }
        },
        {
          "fieldType": "text",
          "name": "phone",
          "fieldLabel": "Phone Number"
        },
        {
          "fieldType": "select",
          "name": "department",
          "fieldLabel": "Department",
          "field_custom_info": {
            "options": "Engineering:engineering, Design:design, Marketing:marketing, HR:hr"
          }
        }
      ]
    },
    {
      "section_name": "social_media",
      "section_title": "Social Media",
      "section_icon": "share",
      "fields": [
        {
          "fieldType": "input",
          "name": "linkedin_url",
          "fieldLabel": "LinkedIn Profile",
          "field_custom_info": {
            "type": "url",
            "placeholder": "https://linkedin.com/in/..."
          }
        },
        {
          "fieldType": "input",
          "name": "github_url",
          "fieldLabel": "GitHub Profile",
          "field_custom_info": {
            "type": "url",
            "placeholder": "https://github.com/..."
          }
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
  "message": "User meta fields saved successfully."
}
```

### Error Response

```json
{ "status": false, "message": "sections is required." }
```

---

## Accessing Saved Data

Field values saved to user meta are retrieved using the native WordPress function:

```php
$title      = get_user_meta( $user_id, 'title', true );
$department = get_user_meta( $user_id, 'department', true );
```

---

## Permission

Requires the `manage_options` WordPress capability.

---

## Related

- [Field Schema](field-schema.md) — Shared schema for field definitions
