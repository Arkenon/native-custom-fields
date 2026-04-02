## PHP Field Configuration Reference

### Border Box

Use this config when `fieldType` is `border_box`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `border_box` | `border_box` | Sets control type. |
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


#### 2) Border Box Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `popoverPlacement` | No | `string` | `top` | `top`, `left`, `right`, `bottom`, `top-end`, `top-start`, `left-end`, `left-start`, `right-end`, `right-start`, `bottom-end`, `bottom-start`, `overlay` | The position of the color popovers relative to the control wrapper. |
| `popoverOffset` | No | `int` |  |  | The space between the popover and the control wrapper. |
| `size` | No | `string` | `default` | `default`, `__unstable-large` | Sets control size. |
| `disableCustomColors` | No | `bool` | `false` | `true`, `false` | Toggles the ability to choose custom colors. |
| `enableAlpha` | No | `bool` | `false` | `true`, `false` | Controls whether the alpha channel will be offered when selecting custom colors. |
| `enableStyle` | No | `bool` | `true` | `true`, `false` | Controls whether to support border style selections. |
| `colors` | No | `string` |  |  | JSON array of color objects for the color palette. Example: `[{"color": "#72aee6", "name": "Blue 20"}]` |

#### 3) PHP Array Schema
Here is an example of how to use the border box control in a post meta configuration:
```php
[
    'fieldType' => 'border_box',
    'name' => 'post_border_box',
    'fieldLabel' => 'Post Border Box',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Set border styles for each side.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'popoverPlacement' => 'top',
    'popoverOffset' => 8,
    'size' => 'default',
    'disableCustomColors' => false,
    'enableAlpha' => false,
    'enableStyle' => true,
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
            'fieldType' => 'border_box',
            'name' => 'post_border_box',
            'fieldLabel' => 'Post Border Box',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Set border styles for each side.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'popoverPlacement' => 'top',
            'popoverOffset' => 8,
            'size' => 'default',
            'disableCustomColors' => false,
            'enableAlpha' => false,
            'enableStyle' => true,
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
| border_box | string (serialized JSON, for example "{\"top\":{\"color\":\"#72aee6\",\"style\":\"solid\",\"width\":\"1px\"},\"right\":{...},\"bottom\":{...},\"left\":{...}}") |
