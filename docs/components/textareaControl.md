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
