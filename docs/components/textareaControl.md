## PHP Field Configuration Reference

### Textarea

Use this config when `fieldType` is `textarea`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `textarea` | `textarea` | Sets control type. |
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


#### 2) Textarea Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `rows` | No | `int` | `4` |  | The number of visible text rows. |
| `placeholder` | No | `string` |  |  | Placeholder text for the textarea. |

#### 3) PHP Array Schema
Here is an example of how to use the textarea control in a post meta configuration:
```php
[
    'fieldType' => 'textarea',
    'name' => 'post_textarea',
    'fieldLabel' => 'Post Textarea',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Enter multi-line text.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'rows' => 4,
    'placeholder' => 'Enter text...',
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
            'fieldType' => 'textarea',
            'name' => 'post_textarea',
            'fieldLabel' => 'Post Textarea',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Enter multi-line text.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'rows' => 4,
            'placeholder' => 'Enter text...',
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| textarea | string |

#### 5) Sanitization & Allowing HTML

By default, `textarea` (and `code`/`wysiwyg`) values are sanitized with WordPress's
`sanitize_textarea_field()`, which strips all HTML — including HTML comments such as
Gutenberg's block markers (`<!-- wp:heading -->`). This is intentional: NCF does not allow
raw HTML in textarea fields out of the box.

If your project needs to store content that includes HTML (e.g. Gutenberg block markup,
or Markdown mixed with HTML), use the `ncf_sanitize_field_value` filter to override NCF's
default sanitization for that specific field, without changing NCF's behavior for every
other field:

```php
add_filter( 'ncf_sanitize_field_value', function ( $sanitized, $raw_value, $field_type, $field_name ) {
    if ( $field_type === 'textarea' && $field_name === 'post_textarea' ) {
        // $raw_value is the raw, unslashed input — apply your own sanitizer here.
        return wp_kses_post( $raw_value );
    }

    return $sanitized;
}, 10, 4 );
```

Filter arguments:

| Argument | Type | Description |
|---|---|---|
| `$sanitized` | `mixed` | NCF's default-sanitized value. |
| `$raw_value` | `mixed` | Raw (unslashed) value, prior to sanitization. |
| `$field_type` | `string` | Field type, e.g. `text`, `textarea`, `code`, `wysiwyg`, `number`. |
| `$field_name` | `string` | Field `name`/meta key, so you can target a single field. Empty string if not available in that context (e.g. plain multi-select array items). |

This filter runs for every field type, not just `textarea` — it's a general sanitization
override point, so you can also use it to relax/tighten sanitization for `text`, `url`,
`email`, etc. Always sanitize/escape `$raw_value` yourself before returning it; never return
it unsanitized.
