## PHP Field Configuration Reference

### Time Picker

Use this config when `fieldType` is `time_picker`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `time_picker` | `time_picker` | Sets control type. |
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


#### 2) Time Picker Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `dateOrder` | No | `string` | `dmy` | `dmy`, `mdy`, `ymd` | The order of day, month, and year. This prop overrides the time format determined by is12Hour prop. |
| `startOfWeek` | No | `int` | `0` | `0`, `1`, `2`, `3`, `4`, `5`, `6` | The day that the week should start on. 0 for Sunday, 1 for Monday, etc. |
| `is12Hour` | No | `bool` | `false` | `true`, `false` | Whether to use a 12-hour clock. With a 12-hour clock, an AM/PM widget is displayed. |

#### 3) PHP Array Schema
Here is an example of how to use the time picker control in a post meta configuration:
```php
[
    'fieldType' => 'time_picker',
    'name' => 'post_time_picker',
    'fieldLabel' => 'Post Time Picker',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Select a time.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'dateOrder' => 'dmy',
    'startOfWeek' => 0,
    'is12Hour' => false,
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
            'fieldType' => 'time_picker',
            'name' => 'post_time_picker',
            'fieldLabel' => 'Post Time Picker',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Select a time.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'dateOrder' => 'dmy',
            'startOfWeek' => 0,
            'is12Hour' => false,
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| time_picker | string (ISO time string, for example `"14:30:00"`) |
