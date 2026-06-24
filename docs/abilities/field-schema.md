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
    "field_custom_info": { "type": "object" }
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

> \* Nested fields inside `repeater` and `group` cannot be defined via ability.

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
