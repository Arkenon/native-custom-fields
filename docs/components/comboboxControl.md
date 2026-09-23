## PHP Field Configuration Reference

### Combobox

Use this config when `fieldType` is `combobox`.


#### 1) Base Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `fieldType` | Yes | `string` | `combobox` | `combobox` | Sets control type. |
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


#### 2) Combobox Specific Parameters

| Parameter | Required | Type | Default | Choices | Description |
|---|---|---|---|---|---|
| `options` | No | `string` |  |  | A fixed list, or a dynamic token resolved from WordPress data. Static format: `"Option 1 : option_1, Option 2 : option_2"`. Dynamic tokens: `{{posts}}`, `{{pages}}`, `{{users}}`, `{{categories}}`, `{{tags}}`, `{{menus}}`, `{{taxonomies}}`, `{{post_types}}`, with optional REST API parameters (e.g. `{{posts?type=book&per_page=100}}`). See [Dynamic Options](dynamic-options). |
| `expandOnFocus` | No | `bool` | `true` | `true`, `false` | Automatically expand the dropdown when the control is focused. |
| `isLoading` | No | `bool` | `false` | `true`, `false` | Show a spinner (and hide the suggestions dropdown) while data about the matching suggestions is loading. |

#### Dynamic Options and Server-Side Search

`options` also accepts a `{{token}}` that is resolved from WordPress data, for example
`{{posts?type=member}}` for a custom post type.

When the options come from a token, the combobox searches **server side**: what the user types is
sent to the REST API as the `search` argument, so a collection of any size stays reachable even
though a single REST request never returns more than 100 records. In that mode `per_page` only
controls how many entries are listed before anything is typed, and `isLoading` is managed
automatically while results are being fetched. The record matching the stored value is fetched
separately, so a saved selection keeps its label even when it is not among the current search
hits. See [Dynamic Options](dynamic-options).

#### 3) PHP Array Schema
Here is an example of how to use the combobox control in a post meta configuration:
```php
[
    'fieldType' => 'combobox',
    'name' => 'post_combobox',
    'fieldLabel' => 'Post Combobox',
    'required' => false,
    'disabled' => false,
    'hideLabelFromVision' => false,
    'fieldHelpText' => 'Search and select an option.',
    'className' => 'custom-class',
    'fieldLabelPosition' => 'top',
    'fieldLabelTextTransform' => 'uppercase',
    'options' => 'Option 1 : option_1, Option 2 : option_2',
    'expandOnFocus' => true,
    'isLoading' => false,
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
            'fieldType' => 'combobox',
            'name' => 'post_combobox',
            'fieldLabel' => 'Post Combobox',
            'required' => false,
            'disabled' => false,
            'hideLabelFromVision' => false,
            'fieldHelpText' => 'Search and select an option.',
            'className' => 'custom-class',
            'fieldLabelPosition' => 'top',
            'fieldLabelTextTransform' => 'uppercase',
            'options' => 'Option 1 : option_1, Option 2 : option_2',
            'expandOnFocus' => true,
            'isLoading' => false,
            ],
        ],
    ];

    return $configs;
} );
```


#### 4) Stored Value Type

| Field Type | Meta Value Type |
|---|---|
| combobox | string (selected option value) |
