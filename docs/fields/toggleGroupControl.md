## PHP Field Configuration Reference

### Toggle Group

Use this config when `fieldType` is `toggle_group`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `toggle_group` | `toggle_group` | Sets control type. |
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


#### 2) Toggle Group Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `options` | No | `string` |  |  | An array of objects containing the value and label of the options. Format: `"Option 1 : option_1, Option 2 : option_2"`. Supports dynamic keywords: `{{users}}`, `{{posts}}`, `{{pages}}`, `{{taxonomies}}`, `{{categories}}`, `{{tags}}`, `{{menus}}`, `{{roles}}`, `{{post_types}}` with optional REST API parameters (e.g. `{{posts?author=admin&per_page=10}}`). |
| `isAdaptiveWidth` | No | `bool` | `false` | `true`, `false` | Determines if segments should be rendered with equal widths. |
| `isDeselectable` | No | `bool` | `false` | `true`, `false` | Whether an option can be deselected by clicking it again. |
| `isBlock` | No | `bool` | `false` | `true`, `false` | Renders ToggleGroupControl as a block element, spanning the entire width of the available space. Recommended when options are text-based. |

#### 3) PHP Array Schema
Here is an example of how to use the toggle group control in a post meta configuration:
[
    'fieldType' => 'toggle_group',
    'name' => 'post_toggle_group',
    'fieldLabel' => 'Post Toggle Group',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Select an option.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'options' => 'Option 1 : option_1, Option 2 : option_2',
    'isAdaptiveWidth' => false,
    'isDeselectable' => false,
    'isBlock' => false,
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
        'meta_box_id'       => 'post_options',
        'meta_box_title'    => 'Post Options',
        'meta_box_context'  => 'side',
        'meta_box_priority' => 'default',
        'fields'            => [
            [
            'fieldType' => 'toggle_group',
            'name' => 'post_toggle_group',
            'fieldLabel' => 'Post Toggle Group',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Select an option.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'options' => 'Option 1 : option_1, Option 2 : option_2',
            'isAdaptiveWidth' => false,
            'isDeselectable' => false,
            'isBlock' => false,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| toggle_group | string (selected option value) |
