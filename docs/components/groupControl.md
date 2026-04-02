## PHP Field Configuration Reference

### Group

Use this config when `fieldType` is `group`.

A group is a container field that visually groups other fields together. It does not store its own meta value, but the fields it contains do.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `group` | `group` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |
| `hideLabelFromVision` | No | `bool` | `false` | `true`, `false` | Sets control hide label from vision. |
| `fieldHelpText` | No | `string` |  |  | Sets control help text. |
| `className` | No | `string` |  |  | Sets control css class name. |
| `fieldLabelPosition` | No | `string` | `top` | `top`, `left` | Sets control label position. |
| `fieldLabelTextTransform` | No | `string` | `uppercase` | `uppercase`, `capitalize`, `lowercase` | Sets control label text transform. |


#### 2) Group Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `layout` | No | `string` | `flex` | `flex`, `grid` | Select layout of the Group field. |
| `columns` | No | `int` | `3` |  | Column count for grid layout. Only used when layout is `grid`. |
| `direction` | No | `string` | `columnRow` | `row`, `columnRow`, `column` | Flex direction. `columnRow` is a responsive row that stacks on small screens. Only used when layout is `flex`. |
| `justify` | No | `string` | `space-between` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | Justify content alignment. Only used when layout is `flex` and direction is not `column`. |

#### 3) PHP Array Schema
Here is an example of how to use the group control in a post meta configuration:
```php
[
    'fieldType' => 'group',
    'name' => 'post_group',
    'fieldLabel' => 'Post Group',
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Group of related fields.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'layout' => 'flex',
    'direction' => 'columnRow',
    'justify' => 'space-between',
    'fields' => [
        // child fields go here
    ],
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
        'meta_box_id'       => 'post_options',
        'meta_box_title'    => 'Post Options',
        'meta_box_context'  => 'normal',
        'meta_box_priority' => 'default',
        'fields'            => [
            [
            'fieldType' => 'group',
            'name' => 'post_group',
            'fieldLabel' => 'Post Group',
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Group of related fields.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'layout' => 'flex',
            'direction' => 'columnRow',
            'justify' => 'space-between',
            'fields' => [
                [
                    'fieldType' => 'text',
                    'name' => 'child_text_field',
                    'fieldLabel' => 'Child Text Field',
                ],
            ],
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| group | N/A (container field — child fields store their own meta values individually) |
