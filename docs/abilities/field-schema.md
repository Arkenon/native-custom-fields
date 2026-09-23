# Field Schema

This schema is provided by `AbilityFieldAdapterTrait` and is shared by all field-bearing abilities: `save-post-meta-fields`, `save-term-meta-fields`, `save-user-meta-fields`, and `save-options-page-fields`.

## Schema

```json
{
  "type": "object",
  "required": ["fieldType", "name", "fieldLabel"],
  "properties": {
    "fieldType":         { "type": "string" },
    "name":              { "type": "string" },
    "fieldLabel":        { "type": "string" },
    "default":           { "type": "string" },
    "required":          { "type": "boolean", "default": false },
    "disabled":          { "type": "boolean", "default": false },
    "field_custom_info": { "type": "object" },
    "fields":            { "type": "array", "items": { "…this same field schema…" } }
  }
}
```

## Properties

| Property | Required | Type | Description |
|---|---|---|---|
| `fieldType` | Yes | string | Field type. See supported values below. |
| `name` | Yes | string | Unique meta key slug (`sanitize_key` is applied) |
| `fieldLabel` | Yes | string | Label shown in the admin interface |
| `default` | No | string | Default field value |
| `required` | No | boolean | Makes the field mandatory (default: `false`) |
| `disabled` | No | boolean | Disables the field (default: `false`) |
| `field_custom_info` | No | object | Type-specific options (see below) |
| `fields` | No | array | Sub-fields, for `repeater` and `group` only (see [Nested Fields](#nested-fields)) |

## Supported Field Types (`fieldType`)

| Type | Description |
|---|---|
| `text` | Single-line text input |
| `textarea` | Multi-line text input |
| `input` | HTML input (type can be specified) |
| `number` | Numeric input |
| `range` | Range slider |
| `select` | Dropdown list |
| `radio` | Radio buttons |
| `checkbox` | Checkbox |
| `toggle` | On/off toggle switch |
| `toggle_group` | Group of toggle buttons |
| `combobox` | Searchable select box |
| `token_field` | Tag/token input |
| `date_picker` | Date picker |
| `date_time_picker` | Date and time picker |
| `time_picker` | Time picker |
| `file_upload` | File upload |
| `media_library` | WordPress media library picker |
| `color_picker` | Color picker |
| `color_palette` | Color palette picker |
| `font_size` | Font size input |
| `unit` | Unit input |
| `repeater` | Repeatable field group\* |
| `group` | Field group\* |
| `section` | Section heading |

> \* Define the contents of `repeater` and `group` with the `fields` property. See [Nested Fields](#nested-fields).

## `field_custom_info` Options

### `select`, `radio`, `combobox`, `token_field`, `toggle_group`

```json
{
  "options": "Label:value, Label2:value2",
  "multiple": false
}
```

### `input`

```json
{
  "type": "text|email|url|number|date|datetime-local|password",
  "placeholder": "...",
  "min": 0,
  "max": 100,
  "step": 1
}
```

### `textarea`

```json
{
  "placeholder": "...",
  "rows": 4
}
```

### `text`

```json
{
  "placeholder": "..."
}
```

### `number`, `range`

```json
{
  "min": 0,
  "max": 100,
  "step": 1
}
```

### `repeater`

```json
{
  "layout": "table",
  "addButtonText": "Add Item",
  "min": 0,
  "max": 50,
  "initialOpen": false
}
```

`layout` is `table` or `panel` (default `table`). `initialOpen` only applies to the `panel` layout.

### `group`

```json
{
  "layout": "flex",
  "columns": 3,
  "direction": "columnRow",
  "justify": "space-between"
}
```

`layout` is `flex` or `grid`. `columns` only applies to `grid`. `direction` is `row`, `columnRow` or `column`. `justify` is one of `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` and is ignored when `direction` is `column`.

## Nested Fields

`repeater` and `group` fields hold their sub-fields in a `fields` array. Each item is a full field definition using this same schema, so a repeater row can contain any combination of field types.

Sub-field `name` values only have to be unique within their parent — they are stored as keys inside the parent's meta value, not as separate meta keys.

Up to **2 levels** of nesting are supported through abilities (for example `repeater` → `group` → field). The abilities API validates input against a schema expanded to that depth, so deeper structures are rejected. Build them in the field builder UI instead, which has no depth limit.

`fields` is ignored for every field type other than `repeater` and `group`.

### Nested Field Example

A `Certifications` repeater whose rows each hold three fields:

```json
{
  "fieldType": "repeater",
  "name": "certifications",
  "fieldLabel": "Certifications",
  "field_custom_info": {
    "layout": "table",
    "addButtonText": "Add Certification"
  },
  "fields": [
    {
      "fieldType": "text",
      "name": "certification_name",
      "fieldLabel": "Certification Name"
    },
    {
      "fieldType": "text",
      "name": "issuing_body",
      "fieldLabel": "Issuing Body"
    },
    {
      "fieldType": "date_picker",
      "name": "date_earned",
      "fieldLabel": "Date Earned"
    }
  ]
}
```

The stored value is a list of row objects keyed by sub-field name:

```json
[
  { "certification_name": "Gas Safe", "issuing_body": "Gas Safe Register", "date_earned": "2021-04-12" },
  { "certification_name": "NICEIC", "issuing_body": "NICEIC", "date_earned": "2023-09-01" }
]
```

A `repeater` default takes that same shape; a `group` default is a single object keyed by sub-field name.

## Example Field Definition

```json
{
  "fieldType": "select",
  "name": "color_choice",
  "fieldLabel": "Color Choice",
  "default": "blue",
  "required": true,
  "field_custom_info": {
    "options": "Red:red, Blue:blue, Green:green"
  }
}
```
