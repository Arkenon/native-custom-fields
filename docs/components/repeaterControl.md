## PHP Field Configuration Reference

### Repeater

Use this config when `fieldType` is `repeater`.

A repeater allows users to add multiple rows of grouped fields. Each row can contain any supported field types.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `repeater` | `repeater` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |
| `required` | No | `bool` | `false` | `true`, `false` | Sets control required. |
| `disabled` | No | `bool` | `false` | `true`, `false` | Sets control disabled. |
| `hideLabelFromVision` | No | `bool` | `false` | `true`, `false` | Sets control hide label from vision. |
| `fieldHelpText` | No | `string` |  |  | Sets control help text. |
| `className` | No | `string` |  |  | Sets control css class name. |
| `fieldLabelPosition` | No | `string` | `top` | `top`, `left` | Sets control label position. |
| `fieldLabelTextTransform` | No | `string` | `uppercase` | `uppercase`, `capitalize`, `lowercase` | Sets control label text transform. |


#### 2) Repeater Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `layout` | No | `string` | `table` | `table`, `panel` | Set repeater layout. |
| `addButtonText` | No | `string` | `Add Item` |  | Text for the add new item button. |
| `min` | No | `int` | `0` |  | Minimum number of items allowed. |
| `max` | No | `int` | `50` |  | Maximum number of items allowed. |
| `initialOpen` | No | `bool` | `false` | `true`, `false` | Whether repeater item panels are open initially. Only used when layout is `panel`. |

#### 3) PHP Array Schema
Here is an example of how to use the repeater control in a post meta configuration:
[
    'fieldType' => 'repeater',
    'name' => 'post_repeater',
    'fieldLabel' => 'Post Repeater',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Add multiple items.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'layout' => 'table',
    'addButtonText' => 'Add Item',
    'min' => 0,
    'max' => 50,
    'fields' => [
        // child fields go here
    ],
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
        'meta_box_context'  => 'normal',
        'meta_box_priority' => 'default',
        'fields'            => [
            [
            'fieldType' => 'repeater',
            'name' => 'post_repeater',
            'fieldLabel' => 'Post Repeater',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Add multiple items.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'layout' => 'table',
            'addButtonText' => 'Add Item',
            'min' => 0,
            'max' => 50,
            'fields' => [
                [
                    'fieldType' => 'text',
                    'name' => 'item_title',
                    'fieldLabel' => 'Title',
                ],
                [
                    'fieldType' => 'textarea',
                    'name' => 'item_description',
                    'fieldLabel' => 'Description',
                ],
            ],
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| repeater | string (serialized JSON array of row objects, for example `[{"item_title":"Row 1","item_description":"Description 1"},{"item_title":"Row 2","item_description":"Description 2"}]`) |
