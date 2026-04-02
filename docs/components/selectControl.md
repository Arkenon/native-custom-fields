## PHP Field Configuration Reference

### Select

Use this config when `fieldType` is `select`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `select` | `select` | Sets control type. |
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


#### 2) Select Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `options` | No | `string` |  |  | An array of objects containing the value and label of the options. Format: `"Option 1 : option_1, Option 2 : option_2"`. Supports dynamic keywords: `{{users}}`, `{{posts}}`, `{{pages}}`, `{{taxonomies}}`, `{{categories}}`, `{{tags}}`, `{{menus}}`, `{{roles}}`, `{{post_types}}` with optional REST API parameters (e.g. `{{posts?author=admin&per_page=10}}`). |
| `variant` | No | `string` | `default` | `default`, `minimal` | The style variant of the control. |
| `multiple` | No | `bool` | `false` | `true`, `false` | If true, multiple values can be selected. The stored value will be a JSON array. |
| `prefix` | No | `string` |  |  | Renders an element before the input. Accepts text (e.g. `"$"`, `"https://"`) or WordPress icon names (e.g. `"search"`, `"external"`, `"lock"`). |
| `suffix` | No | `string` |  |  | Renders an element after the input. Accepts text (e.g. `"USD"`, `".com"`) or WordPress icon names (e.g. `"search"`, `"external"`, `"lock"`). |

#### 3) PHP Array Schema
Here is an example of how to use the select control in a post meta configuration:
[
    'fieldType' => 'select',
    'name' => 'post_select',
    'fieldLabel' => 'Post Select',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Select an option.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'options' => 'Option 1 : option_1, Option 2 : option_2',
    'variant' => 'default',
    'multiple' => false,
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
            'fieldType' => 'select',
            'name' => 'post_select',
            'fieldLabel' => 'Post Select',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Select an option.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'options' => 'Option 1 : option_1, Option 2 : option_2',
            'variant' => 'default',
            'multiple' => false,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| select | string (selected option value), or string (serialized JSON array) if `multiple` is true (for example `'["option_1","option_2"]'`) |
