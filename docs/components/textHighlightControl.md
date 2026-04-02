## PHP Field Configuration Reference

### Text Highlight

Use this config when `fieldType` is `text_highlight`.

This is a display-only component that renders a text string with highlighted occurrences of a given search term. It does not store any meta value.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `text_highlight` | `text_highlight` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |


#### 2) Text Highlight Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `text` | No | `string` | `` |  | The string of text to be tested for occurrences of the given highlight. |
| `highlight` | No | `string` | `` |  | The string to search for and highlight within the text. Case insensitive, highlights all matches. |

#### 3) PHP Array Schema
Here is an example of how to use the text highlight control in a post meta configuration:
```php
[
    'fieldType' => 'text_highlight',
    'name' => 'post_text_highlight',
    'fieldLabel' => 'Text Highlight',
    'text' => 'The quick brown fox jumps over the lazy dog.',
    'highlight' => 'fox',
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
            'fieldType' => 'text_highlight',
            'name' => 'post_text_highlight',
            'fieldLabel' => 'Text Highlight',
            'text' => 'The quick brown fox jumps over the lazy dog.',
            'highlight' => 'fox',
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| text_highlight | N/A (display-only component, no meta value stored) |
