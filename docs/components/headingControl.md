## PHP Field Configuration Reference

### Heading

Use this config when `fieldType` is `heading`.

This is a display-only component that renders a heading (h1–h6) inside the meta box. It does not store any meta value.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `heading` | `heading` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |


#### 2) Heading Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `text` | No | `string` |  |  | Heading content text. |
| `level` | No | `int` | `2` | `1`, `2`, `3`, `4`, `5`, `6` | The heading level (h1–h6). |

#### 3) PHP Array Schema
Here is an example of how to use the heading control in a post meta configuration:
[
    'fieldType' => 'heading',
    'name' => 'post_heading',
    'fieldLabel' => 'Section Heading',
    'text' => 'Design Settings',
    'level' => 2,
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
            'fieldType' => 'heading',
            'name' => 'post_heading',
            'fieldLabel' => 'Section Heading',
            'text' => 'Design Settings',
            'level' => 2,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| heading | N/A (display-only component, no meta value stored) |
