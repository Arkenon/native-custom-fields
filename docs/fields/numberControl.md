## PHP Field Configuration Reference

### Number

Use this config when `fieldType` is `number`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `number` | `number` | Sets control type. |
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


#### 2) Number Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `min` | No | `int` |  |  | Minimum value for the field. Default is -infinity. |
| `max` | No | `int` |  |  | Maximum value for the field. Default is infinity. |
| `step` | No | `int` | `1` |  | Amount by which the value is changed when incrementing/decrementing. |
| `shiftStep` | No | `int` |  |  | Amount to increment by when the SHIFT key is held down. Default is 10. |
| `dragDirection` | No | `string` | `n` | `n`, `e`, `s`, `w` | Determines the drag axis to increment/decrement the value. |
| `spinControls` | No | `string` | `native` | `native`, `custom`, `none` | The type of spin controls to display. |
| `isShiftStepEnabled` | No | `bool` | `true` | `true`, `false` | If true, pressing UP or DOWN with the SHIFT key will increment by shiftStep value. |
| `isDragEnabled` | No | `bool` | `false` | `true`, `false` | If true, enables mouse drag gesture to increment/decrement the number value. |
| `dragThreshold` | No | `int` |  |  | The amount of px to drag before the value changes. Only relevant if isDragEnabled is true. |

#### 3) PHP Array Schema
Here is an example of how to use the number control in a post meta configuration:
[
    'fieldType' => 'number',
    'name' => 'post_number',
    'fieldLabel' => 'Post Number',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Enter a numeric value.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'min' => 0,
    'max' => 100,
    'step' => 1,
    'spinControls' => 'native',
    'isShiftStepEnabled' => true,
    'isDragEnabled' => false,
]

#### 3) Hook-Based Example (Post Meta Config)

It is available to use this control in post meta fields, term meta fields and user settings page and options page fields.

Available hooks:
- native_custom_fields_post_meta_fields
- native_custom_fields_term_meta_fields
- native_custom_fields_user_meta_fields
- native_custom_fields_options_page_fields

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
            'fieldType' => 'number',
            'name' => 'post_number',
            'fieldLabel' => 'Post Number',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Enter a numeric value.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'min' => 0,
            'max' => 100,
            'step' => 1,
            'spinControls' => 'native',
            'isShiftStepEnabled' => true,
            'isDragEnabled' => false,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| number | string (numeric value stored as string, for example `"42"`) |
