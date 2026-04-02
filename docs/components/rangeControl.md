## PHP Field Configuration Reference

### Range

Use this config when `fieldType` is `range`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `range` | `range` | Sets control type. |
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


#### 2) Range Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `type` | No | `string` | `slider` | `slider`, `stepper` | Define if the value selection should present a slider or stepper control. |
| `marks` | No | `string` |  |  | Renders visual step ticks. Format: `"10% : 10, 20% : 20"`. Only used when type is `stepper`. |
| `min` | No | `int` | `0` |  | The minimum value allowed. |
| `max` | No | `int` | `100` |  | The maximum value allowed. |
| `separatorType` | No | `string` |  | `none`, `fullWidth`, `topFullWidth` | Defines if a separator line should appear above or below the control row. |
| `color` | No | `string` |  |  | CSS color string for the RangeControl wrapper. |
| `allowReset` | No | `bool` | `false` | `true`, `false` | If true, a button to reset the slider is rendered. |
| `resetFallbackValue` | No | `int` | `100` |  | The value to revert to when the Reset button is clicked. Only relevant if allowReset is true. |
| `isShiftStepEnabled` | No | `bool` | `false` | `true`, `false` | If true, pressing UP or DOWN with the SHIFT key changes the value by shiftStep. |
| `shiftStep` | No | `int` |  |  | Acts as a multiplier of step when shift key is held. Only relevant if withInputField and isShiftStepEnabled are both true. |
| `withInputField` | No | `bool` | `false` | `true`, `false` | Determines if a numeric input field renders next to the range slider. |
| `showTooltip` | No | `bool` | `false` | `true`, `false` | Forces the tooltip UI to show or hide. |

#### 3) PHP Array Schema
Here is an example of how to use the range control in a post meta configuration:
```php
[
    'fieldType' => 'range',
    'name' => 'post_range',
    'fieldLabel' => 'Post Range',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Drag to select a value.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'type' => 'slider',
    'min' => 0,
    'max' => 100,
    'allowReset' => false,
    'withInputField' => false,
    'showTooltip' => false,
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
            'fieldType' => 'range',
            'name' => 'post_range',
            'fieldLabel' => 'Post Range',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Drag to select a value.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'type' => 'slider',
            'min' => 0,
            'max' => 100,
            'allowReset' => false,
            'withInputField' => false,
            'showTooltip' => false,
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| range | string (numeric value stored as string, for example `"50"`) |
