## 9) Block Bindings

NCF registers its own [block bindings](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/) source, `native-custom-fields/post-meta`. It lets you connect block attributes (for example a paragraph's content or a button's URL) to post meta fields built with NCF, **including fields that store arrays or objects**.

### Why a separate source?

The core `core/post-meta` source lists a meta field in the editor only when its registered `type` matches the attribute type. Paragraph and heading content are `string`, so `token_field`, multiple `select`, `repeater`, `group`, `file_upload` and `media_library` fields, which are registered as `array` or `object`, are not listed. Registering them as `string` through `native_custom_fields_register_post_meta_type` is not a fix: the stored value is still an array, so REST returns a wrong value.

The NCF source keeps the meta registration as it is. It lists every NCF field as a `string` field and formats the stored value as text.

### Usage

1. Select a supported block (paragraph, heading, button, image ...) in a post of a post type that has NCF fields.
2. Open **Attributes** in the block sidebar, choose the attribute, then **Native Custom Fields**, and pick the field. Fields are listed by their label.

The same binding in block markup:

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"native-custom-fields/post-meta","args":{"key":"my_token_field"}}}}} -->
<p></p>
<!-- /wp:paragraph -->
```

The source is read only: values are edited in the meta box, not in the bound block. The editor preview shows the saved value.

### How values are formatted

| Field type | Output |
|---|---|
| text, textarea, number, ... | The value. Line breaks become `<br>` in rich text. |
| select, radio, toggle_group, combobox | The option label (`İngilizce:ingilizce` shows `İngilizce`). Dynamic options show the stored value. |
| token_field, multiple select | Items joined with `, `. |
| toggle, checkbox | `Yes` / `No` (translatable). |
| file_upload, media_library | File URLs joined with `, `. Bound to a `url` attribute (image, button), the first URL. |
| repeater | One line per row, sub-field values joined with ` — `. Rows are separated by `<br>` in rich text and by `, ` elsewhere. |
| group | `Label: value` lines, separated like repeater rows. |

Text is escaped for rich text attributes. A repeater cannot become a real `<table>` here, because a table inside a paragraph or heading is invalid HTML. For a table, list or custom layout, use the filter below or build a custom block.

### Customizing the output

```php
add_filter( 'native_custom_fields_block_bindings_value', function( $value, $raw_value, $field, $post_id, $attribute_name ) {
    if ( 'my_social_links' === ( $field['name'] ?? '' ) && is_array( $raw_value ) ) {
        $links = array();
        foreach ( $raw_value as $row ) {
            $links[] = sprintf( '<a href="%s">%s</a>', esc_url( $row['url'] ?? '' ), esc_html( $row['name'] ?? '' ) );
        }
        return implode( ' · ', $links );
    }
    return $value;
}, 10, 5 );
```

To show the same output in the editor preview, add the JS filter `nativeCustomFields.blockBindingsValue` with `@wordpress/hooks` (same arguments).

### Notes

- Access follows `core/post-meta`: a value is returned only when the post is public or the user can read it, the post is not password protected, the meta key is not protected (does not start with `_`), and the field is registered with `show_in_rest`.
- Only fields defined in the NCF post meta configuration of the post's type can be read through this source.
- To bind attributes other than the core defaults, use the core `block_bindings_supported_attributes` filter. To change values of any source, the core `block_bindings_source_value` filter (WP 6.7+) is also available.
