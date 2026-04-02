## PHP Field Configuration Reference

### Input

Use this config when `fieldType` is `input`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `input` | `input` | Sets control type. |
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


#### 2) Input Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `id` | No | `string` |  |  | The id of the input element. |
| `size` | No | `string` | `default` | `default`, `small`, `__unstable-large`, `compact` | Adjusts the size of the input. |
| `placeholder` | No | `string` |  |  | Placeholder text for the input. |
| `prefix` | No | `string` |  |  | Renders an element before the input. Accepts text (e.g. `"$"`, `"https://"`) or WordPress icon names (e.g. `"search"`, `"external"`, `"lock"`). |
| `suffix` | No | `string` |  |  | Renders an element after the input. Accepts text (e.g. `"USD"`, `".com"`) or WordPress icon names (e.g. `"search"`, `"external"`, `"lock"`). |
| `type` | No | `string` | `text` | `text`, `tel`, `time`, `url`, `week`, `month`, `email`, `date`, `datetime-local`, `number`, `color`, `password` | Type of the input element. |
| `min` | No | `int` |  |  | Minimum value. Only applicable for number type. |
| `max` | No | `int` |  |  | Maximum value. Only applicable for number type. |
| `step` | No | `int` |  |  | Amount to increment/decrement. Only applicable for number type. Default is 1. |
| `isPressEnterToChange` | No | `bool` | `false` | `true`, `false` | If true, the ENTER key confirmation is required in order to trigger an onChange. |

#### 3) PHP Array Schema
Here is an example of how to use the input control in a post meta configuration:
```php
[
    'fieldType' => 'input',
    'name' => 'post_input',
    'fieldLabel' => 'Post Input',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Enter a value.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'size' => 'default',
    'placeholder' => 'Enter value...',
    'type' => 'text',
    'isPressEnterToChange' => false,
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
            'fieldType' => 'input',
            'name' => 'post_input',
            'fieldLabel' => 'Post Input',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Enter a value.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'size' => 'default',
            'placeholder' => 'Enter value...',
            'type' => 'text',
            'isPressEnterToChange' => false,
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| input | string |
