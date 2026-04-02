## PHP Field Configuration Reference

### Border

Use this config when `fieldType` is `border`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `border` | `border` | Sets control type. |
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


#### 2) Border Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `size` | No | `string` | `default` | `default`, `__unstable-large` | Sets control size. |
| `disableCustomColors` | No | `bool` | `false` | `true`, `false` | Toggles the ability to choose custom colors. |
| `disableUnits` | No | `bool` | `false` | `true`, `false` | Controls whether unit selection should be disabled. |
| `enableAlpha` | No | `bool` | `false` | `true`, `false` | Controls whether the alpha channel will be offered when selecting custom colors. |
| `enableStyle` | No | `bool` | `true` | `true`, `false` | Controls whether to support border style selections. |
| `isCompact` | No | `bool` | `false` | `true`, `false` | Renders the control with a more compact appearance, restricting its width. |
| `shouldSanitizeBorder` | No | `bool` | `true` | `true`, `false` | If no width or color is selected, the border style is also cleared and `undefined` is returned. |
| `withSlider` | No | `bool` | `false` | `true`, `false` | Renders an additional RangeControl for more control over border width. |
| `colors` | No | `string` |  |  | JSON array of color objects for the color palette. Example: `[{"color": "#72aee6", "name": "Blue 20"}]` |

#### 3) PHP Array Schema
Here is an example of how to use the border control in a post meta configuration:
```php
[
    'fieldType' => 'border',
    'name' => 'post_border',
    'fieldLabel' => 'Post Border',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Set border style.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'size' => 'default',
    'disableCustomColors' => false,
    'disableUnits' => false,
    'enableAlpha' => false,
    'enableStyle' => true,
    'isCompact' => false,
    'shouldSanitizeBorder' => true,
    'withSlider' => false,
    'colors' => '[{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]',
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
            'fieldType' => 'border',
            'name' => 'post_border',
            'fieldLabel' => 'Post Border',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Set border style.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'size' => 'default',
            'disableCustomColors' => false,
            'disableUnits' => false,
            'enableAlpha' => false,
            'enableStyle' => true,
            'isCompact' => false,
            'shouldSanitizeBorder' => true,
            'withSlider' => false,
            'colors' => '[{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]',
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| border | string (serialized JSON, for example "{\"color\":\"#72aee6\",\"style\":\"solid\",\"width\":\"1px\"}") |
