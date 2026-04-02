## PHP Field Configuration Reference

### Font Size

Use this config when `fieldType` is `font_size`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `font_size` | `font_size` | Sets control type. |
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


#### 2) Font Size Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `size` | No | `string` | `default` | `default`, `__unstable-large` | Sets control size. |
| `units` | No | `string` | `["px","em","rem","vw","vh"]` | `px`, `em`, `rem`, `vw`, `vh` | Available units for custom font size selection. Accepts a JSON array of unit strings. |
| `disableCustomFontSizes` | No | `bool` | `false` | `true`, `false` | If true, the user is forced to pick one of the pre-defined font sizes from fontSizes. |
| `withReset` | No | `bool` | `true` | `true`, `false` | If true, a reset button will be displayed alongside the input field when a custom font size is active. |
| `withSlider` | No | `bool` | `false` | `true`, `false` | If true, a slider will be displayed alongside the input field when a custom font size is active. |
| `fallbackFontSize` | No | `int` |  |  | If no value exists, defines the starting position for the font size picker slider. Only relevant if withSlider is true. |
| `valueMode` | No | `string` |  | `literal`, `slug` | Determines how the value prop should be interpreted. `literal`: contains the actual font size value. `slug`: contains the slug of the selected font size. |
| `fontSizes` | No | `string` |  |  | JSON array of font size objects. Example: `[{"name": "Small", "size": 12, "slug": "small"}]` |

#### 3) PHP Array Schema
Here is an example of how to use the font size control in a post meta configuration:
```php
[
    'fieldType' => 'font_size',
    'name' => 'post_font_size',
    'fieldLabel' => 'Post Font Size',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Set the font size.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'size' => 'default',
    'units' => '["px","em","rem","vw","vh"]',
    'disableCustomFontSizes' => false,
    'withReset' => true,
    'withSlider' => false,
    'fontSizes' => '[{"name": "Small", "size": 12, "slug": "small"}, {"name": "Normal", "size": 16, "slug": "normal"}]',
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
            'fieldType' => 'font_size',
            'name' => 'post_font_size',
            'fieldLabel' => 'Post Font Size',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Set the font size.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'size' => 'default',
            'units' => '["px","em","rem","vw","vh"]',
            'disableCustomFontSizes' => false,
            'withReset' => true,
            'withSlider' => false,
            'fontSizes' => '[{"name": "Small", "size": 12, "slug": "small"}, {"name": "Normal", "size": 16, "slug": "normal"}]',
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| font_size | string (font size value with unit, for example `"16px"`) |
