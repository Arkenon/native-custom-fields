## PHP Field Configuration Reference

### Unit

Use this config when `fieldType` is `unit`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `unit` | `unit` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |
| `default` | No | `string` |  |  | Sets control default value. |
| `required` | No | `bool` | `false` | `true`, `false` | Sets control required. |
| `disabled` | No | `bool` | `false` | `true`, `false` | Sets control disabled. |
| `hideLabelFromVision` | No | `bool` | `false` | `true`, `false` | Sets control hide label from vision. |
| `fieldHelpText` | No | `string` |  |  | Sets control help text. |
| `className` | No | `string` |  |  | Sets control css class name. |
| `fieldLabelPosition` | No | `string` | `top` | `top`, `left` | Sets control label position. |
| `fieldLabelTextTransform` | No | `string` | `uppercase` | `uppercase`, `capitalize`, `lowercase` | Sets control label text transform. |


#### 2) Unit Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `size` | No | `string` | `default` | `default`, `small` | Adjusts the size of the input. |
| `disableUnits` | No | `bool` | `false` | `true`, `false` | If true, the unit selector is hidden. |
| `isPressEnterToChange` | No | `bool` | `false` | `true`, `false` | If true, the ENTER key press is required to trigger an onChange. A change is also triggered on blur. |
| `isResetValueOnUnitChange` | No | `bool` | `false` | `true`, `false` | If true, and the selected unit provides a default value, this value is set when changing units. |
| `isUnitSelectTabbable` | No | `bool` | `true` | `true`, `false` | Determines if the unit select is tabbable. |

#### 3) PHP Array Schema
Here is an example of how to use the unit control in a post meta configuration:
```php
[
    'fieldType' => 'unit',
    'name' => 'post_unit',
    'fieldLabel' => 'Post Unit',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Enter a value with unit.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'size' => 'default',
    'disableUnits' => false,
    'isPressEnterToChange' => false,
    'isResetValueOnUnitChange' => false,
    'isUnitSelectTabbable' => true,
]
```

#### 3) Hook-Based Example (Post Meta Config)

It is available to use this control in post meta fields, term meta fields and user settings page and options page fields.

Available hooks:
- native_custom_fields_post_meta_fields
- native_custom_fields_term_meta_fields
- native_custom_fields_user_meta_fields
- native_custom_fields_options_page_fields

```php
add_filter( 'native_custom_fields_post_meta_fields', function( array $configs ): array {
    $post_type = 'book';

    if ( ! isset( $configs[ $post_type ] ) || ! is_array( $configs[ $post_type ] ) ) {
        $configs[ $post_type ] = [
            'post_type' => $post_type,
            'sections'  => [],
        ];
    }

    $configs[ $post_type ]['sections'][] = [
        'meta_box_id'       => 'design_settings',
        'meta_box_title'    => 'Design Settings',
        'meta_box_context'  => 'side',
        'meta_box_priority' => 'default',
        'fields'            => [
            [
            'fieldType' => 'unit',
            'name' => 'post_unit',
            'fieldLabel' => 'Post Unit',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Enter a value with unit.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'size' => 'default',
            'disableUnits' => false,
            'isPressEnterToChange' => false,
            'isResetValueOnUnitChange' => false,
            'isUnitSelectTabbable' => true,
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| unit | string (value with unit, for example `"10px"`) |
