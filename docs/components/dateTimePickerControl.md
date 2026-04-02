## PHP Field Configuration Reference

### Date Time Picker

Use this config when `fieldType` is `date_time_picker`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `date_time_picker` | `date_time_picker` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |
| `required` | No | `bool` | `false` | `true`, `false` | Sets control required. |
| `disabled` | No | `bool` | `false` | `true`, `false` | Sets control disabled. |
| `hideLabelFromVision` | No | `bool` | `false` | `true`, `false` | Sets control hide label from vision. |
| `fieldHelpText` | No | `string` |  |  | Sets control help text. |
| `className` | No | `string` |  |  | Sets control css class name. |
| `fieldLabelPosition` | No | `string` | `top` | `top`, `left` | Sets control label position. |
| `fieldLabelTextTransform` | No | `string` | `uppercase` | `uppercase`, `capitalize`, `lowercase` | Sets control label text transform. |


#### 2) Date Time Picker Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `currentDate` | No | `string` |  |  | The current date and time at initialization. Use datetime-local format (e.g. `2024-01-15T10:30`). |
| `dateOrder` | No | `string` | `dmy` | `dmy`, `mdy`, `ymd` | The order of day, month, and year. This prop overrides the time format determined by is12Hour prop. |
| `startOfWeek` | No | `int` | `0` | `0`, `1`, `2`, `3`, `4`, `5`, `6` | The day that the week should start on. 0 for Sunday, 1 for Monday, etc. |
| `is12Hour` | No | `bool` | `false` | `true`, `false` | Whether to use a 12-hour clock. With a 12-hour clock, an AM/PM widget is displayed and the time format is assumed to be MM-DD-YYYY. |

#### 3) PHP Array Schema
Here is an example of how to use the date time picker control in a post meta configuration:
```php
[
    'fieldType' => 'date_time_picker',
    'name' => 'post_date_time_picker',
    'fieldLabel' => 'Post Date Time Picker',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Select a date and time.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'currentDate' => '',
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
            'fieldType' => 'date_time_picker',
            'name' => 'post_date_time_picker',
            'fieldLabel' => 'Post Date Time Picker',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Select a date and time.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'currentDate' => '',
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
| date_time_picker | string (ISO datetime string, for example `"2024-01-15T10:30:00"`) |
