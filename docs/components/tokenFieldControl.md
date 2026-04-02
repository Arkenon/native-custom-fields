## PHP Field Configuration Reference

### Token Field

Use this config when `fieldType` is `token_field`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `token_field` | `token_field` | Sets control type. |
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


#### 2) Token Field Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `maxLength` | No | `int` |  |  | Disables adding new tokens once the number of tokens reaches or exceeds this value. |
| `maxSuggestions` | No | `int` | `100` |  | The maximum number of suggestions to display at a time. |
| `suggestions` | No | `string` |  |  | An array of suggested token strings. Separate values with commas (e.g. `"Africa, Europe, Asia"`). |
| `allowOnlySuggestions` | No | `bool` | `false` | `true`, `false` | If true, only tokens matching a suggestion can be added. Only relevant if suggestions is set. |
| `__experimentalAutoSelectFirstMatch` | No | `bool` | `false` | `true`, `false` | If true, automatically selects the first matching suggestion when Enter (or space if tokenizeOnSpace) is pressed. |
| `__experimentalExpandOnFocus` | No | `bool` | `false` | `true`, `false` | If true, the suggestions list is always expanded when the input field has focus. |
| `isBorderless` | No | `bool` | `false` | `true`, `false` | When true, renders tokens without a background. |
| `tokenizeOnBlur` | No | `bool` | `false` | `true`, `false` | If true, adds any incomplete token value as a new token when the field loses focus. |
| `tokenizeOnSpace` | No | `bool` | `false` | `true`, `false` | If true, adds a token when the field is focused and space is pressed. |

#### 3) PHP Array Schema
Here is an example of how to use the token field control in a post meta configuration:
```php
[
    'fieldType' => 'token_field',
    'name' => 'post_token_field',
    'fieldLabel' => 'Post Token Field',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Add tags or keywords.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'maxSuggestions' => 100,
    'suggestions' => 'Africa, Europe, Asia',
    'allowOnlySuggestions' => false,
    'isBorderless' => false,
    'tokenizeOnBlur' => false,
    'tokenizeOnSpace' => false,
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
        'meta_box_context'  => 'side',
        'meta_box_priority' => 'default',
        'fields'            => [
            [
            'fieldType' => 'token_field',
            'name' => 'post_token_field',
            'fieldLabel' => 'Post Token Field',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Add tags or keywords.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'maxSuggestions' => 100,
            'suggestions' => 'Africa, Europe, Asia',
            'allowOnlySuggestions' => false,
            'isBorderless' => false,
            'tokenizeOnBlur' => false,
            'tokenizeOnSpace' => false,
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| token_field | string (serialized JSON array of token strings, for example `'["tag1","tag2","tag3"]'`) |
