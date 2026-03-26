## PHP Field Configuration Reference

### File Upload

Use this config when `fieldType` is `file_upload`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `file_upload` | `file_upload` | Sets control type. |
| `name` | Yes | `string` |  |  | Sets control name. Use snake_case. |
| `fieldLabel` | Yes | `string` |  |  | Sets control label. |
| `required` | No | `bool` | `false` | `true`, `false` | Sets control required. |
| `disabled` | No | `bool` | `false` | `true`, `false` | Sets control disabled. |
| `hideLabelFromVision` | No | `bool` | `false` | `true`, `false` | Sets control hide label from vision. |
| `fieldHelpText` | No | `string` |  |  | Sets control help text. |
| `className` | No | `string` |  |  | Sets control css class name. |
| `fieldLabelPosition` | No | `string` | `top` | `top`, `left` | Sets control label position. |
| `fieldLabelTextTransform` | No | `string` | `uppercase` | `uppercase`, `capitalize`, `lowercase` | Sets control label text transform. |


#### 2) File Upload Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `accept` | No | `string` |  |  | Specifies which file types can be uploaded. Accepts file extensions (`.jpg`, `.png`, `.pdf`), MIME types (`image/*`, `video/*`, `text/plain`), or mixed (`image/*,.pdf,.doc`). Separate multiple values with commas. |
| `maxFileSize` | No | `int` |  |  | Maximum file size in kilobytes (KB). For example, set `2500` for 2500 KB (2.5 MB). |
| `multiple` | No | `bool` | `false` | `true`, `false` | Whether to allow multiple file selection. |

#### 3) PHP Array Schema
Here is an example of how to use the file upload control in a post meta configuration:
[
    'fieldType' => 'file_upload',
    'name' => 'post_file_upload',
    'fieldLabel' => 'Post File Upload',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Upload a file.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'accept' => 'image/*,.pdf',
    'maxFileSize' => 2500,
    'multiple' => false,
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
            'fieldType' => 'file_upload',
            'name' => 'post_file_upload',
            'fieldLabel' => 'Post File Upload',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Upload a file.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'accept' => 'image/*,.pdf',
            'maxFileSize' => 2500,
            'multiple' => false,
            ],
        ],
    ];

    return $configs;
} );


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| file_upload | string (serialized JSON, for example `{"name":"file.pdf","url":"https://example.com/wp-content/uploads/file.pdf","type":"application/pdf","size":12345}`) or JSON array if `multiple` is true |
