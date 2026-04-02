## PHP Field Configuration Reference

### Color Picker

Use this config when `fieldType` is `color_picker`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `color_picker` | `color_picker` | Sets control type. |
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


#### 2) Color Picker Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `color` | No | `string` |  |  | The current color value to display in the picker. Must be a hex or hex8 string. |
| `enableAlpha` | No | `bool` | `false` | `true`, `false` | When true the color picker will display the alpha channel both in the bottom inputs as well as in the color picker itself. |
| `copyFormat` | No | `string` | `hex` | `hex`, `hsl`, `rgb` | The format to copy when clicking the displayed color format. |

#### 3) PHP Array Schema
Here is an example of how to use the color picker control in a post meta configuration:
```php
[
    'fieldType' => 'color_picker',
    'name' => 'post_color_picker',
    'fieldLabel' => 'Post Color Picker',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Select a color.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'color' => '#72aee6',
    'enableAlpha' => false,
    'copyFormat' => 'hex',
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
            'fieldType' => 'color_picker',
            'name' => 'post_color_picker',
            'fieldLabel' => 'Post Color Picker',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Select a color.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'color' => '#72aee6',
            'enableAlpha' => false,
            'copyFormat' => 'hex',
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| color_picker | string (hex color code, for example `"#72aee6"`) |
