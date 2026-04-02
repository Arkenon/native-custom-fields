## PHP Field Configuration Reference

### Notice

Use this config when `fieldType` is `notice`.

This is a display-only component that renders a notice/alert message inside the meta box. It does not store any meta value.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `notice` | `notice` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |


#### 2) Notice Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `children` | Yes | `string` |  |  | The displayed message of the notice. |
| `status` | No | `string` | `info` | `warning`, `success`, `error`, `info` | Determines the color of the notice: `warning` (yellow), `success` (green), `error` (red), `info` (blue). |

#### 3) PHP Array Schema
Here is an example of how to use the notice control in a post meta configuration:
```php
[
    'fieldType' => 'notice',
    'name' => 'post_notice',
    'fieldLabel' => 'Notice',
    'children' => 'This is an informational notice.',
    'status' => 'info',
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
            'fieldType' => 'notice',
            'name' => 'post_notice',
            'fieldLabel' => 'Notice',
            'children' => 'This is an informational notice.',
            'status' => 'info',
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| notice | N/A (display-only component, no meta value stored) |
