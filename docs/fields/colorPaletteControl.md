## PHP Field Configuration Reference

### Color Palette

Use this config when `fieldType` is `color_palette`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `color_palette` | `color_palette` | Sets control type. |
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


#### 2) Color Palette Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `colors` | No | `string` |  |  | JSON array of color objects for the color palette. Example: `[{"color": "#72aee6", "name": "Blue 20"}]` |
| `clearable` | No | `bool` | `true` | `true`, `false` | Whether the palette should have a clearing button. |
| `disableCustomColors` | No | `bool` | `false` | `true`, `false` | Whether to allow the user to pick a custom color on top of the predefined choices (defined via the colors prop). |
| `enableAlpha` | No | `bool` | `false` | `true`, `false` | Controls whether the alpha channel will be offered when selecting custom colors. |
| `asButtons` | No | `bool` | `false` | `true`, `false` | Whether the control should present as a set of buttons, each with its own tab stop. |
| `loop` | No | `bool` | `true` | `true`, `false` | Prevents keyboard interaction from wrapping around. Only used when asButtons is not true. |

#### 3) PHP Array Schema
Here is an example of how to use the color palette control in a post meta configuration:
[
    'fieldType' => 'color_palette',
    'name' => 'post_color_palette',
    'fieldLabel' => 'Post Color Palette',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Select a color from the palette.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'colors' => '[{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]',
    'clearable' => true,
    'disableCustomColors' => false,
    'enableAlpha' => false,
    'asButtons' => false,
    'loop' => true,
]

#### 3) Hook-Based Example (Post Meta Config)

It is available to use this control in post meta fields, term meta fields and user settings page and options page fields.

Available hooks:
- native_custom_fields_post_meta_fields
- native_custom_fields_term_meta_fields
- native_custom_fields_user_meta_fields
- native_custom_fields_options_page_fields

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
            'fieldType' => 'color_palette',
            'name' => 'post_color_palette',
            'fieldLabel' => 'Post Color Palette',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Select a color from the palette.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'colors' => '[{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]',
            'clearable' => true,
            'disableCustomColors' => false,
            'enableAlpha' => false,
            'asButtons' => false,
            'loop' => true,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| color_palette | string (hex color code, for example `"#72aee6"`) |
