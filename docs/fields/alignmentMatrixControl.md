## PHP Field Configuration Reference

### Alignment Matrix

Use this config when `fieldType` is `alignment_matrix`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `alignment_matrix` | `alignment_matrix` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |
| `default` | No | `string` |  |  | Sets control default value. `center`
`top center`
`top right`
`top left`
`bottom center`
`bottom right`
`bottom left`
`center left`
`center center`
`center right` |
| `required` | No | `bool` | `false` | `true`, `false` | Sets control required. |
| `disabled` | No | `bool` | `false` | `true`, `false` | Sets control disabled. |
| `hideLabelFromVision` | No | `bool` | `false` | `true`, `false` | Sets control hide label from vision. |
| `fieldHelpText` | No | `string` |  |  | Sets control help text. |
| `className` | No | `string` |  |  | Sets control css class name. |
| `fieldLabelPosition` | No | `string` | `top` | `top`, `left` | Sets control label position. |
| `fieldLabelTextTransform` | No | `string` | `uppercase` | `uppercase`, `capitalize`, `lowercase` | Sets control label text transform. |


#### 2) Alignment Matrix Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `width` | No | `int` | `92` |  | Sets control width. |

#### 3) PHP Array Schema

[
    'fieldType' => 'alignment_matrix',
    'name' => 'content_alignment',
    'fieldLabel' => 'Content Alignment',
    'default' => 'center center', // optional
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Choose alignment.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'width' => 92,
]

#### 3) Hook-Based Example (Post Meta Config)

add_filter( 'native_custom_fields_post_meta_fields', function( array $configs ): array {
    $post_type = 'book';

    if ( ! isset( $configs[ $post_type ] ) || ! is_array( $configs[ $post_type ] ) ) {
        $configs[ $post_type ] = [
            'post_type' => $post_type,
            'sections'  => [],
        ];
    }

    $configs[ $post_type ]['sections'][] = [
        'meta_box_id'       => 'layout_settings',
        'meta_box_title'    => 'Layout Settings',
        'meta_box_context'  => 'side',
        'meta_box_priority' => 'default',
        'fields'            => [
            [
             'fieldType' => 'alignment_matrix',
    'name' => 'content_alignment',
    'fieldLabel' => 'Content Alignment',
    'default' => 'center center', // optional
    'required' => false,
     'hideLabelFromVision' => false,
   'fieldHelpText' => 'Choose alignment.',
     'width' => 92,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

Field Type	Meta Value Type
alignment_matrix	string (for example alignment token from WP control)

​