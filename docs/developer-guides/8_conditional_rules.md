## 8) Conditional Rules

NCF provides the `dependencies` parameter to show or hide fields based on the values of other fields. You can define conditional rules to create interactive and dynamic forms.

### Basic Structure

The `dependencies` parameter takes an array with two main keys:
- `relation`: Defines the logical relation between multiple conditions. Accepts `'and'` or `'or'`. (Default is `'and'`).
- `conditions`: An array of condition rules. Each rule is an array containing:
  - `field` (string): The name of the target field to check against.
  - `operator` (string): The comparison operator.
  - `value` (mixed): The value to compare against. (e.g., `true`, `false`, or a specific string/number).

### Available Operators

You can use the following operators in your conditions:
- `==` : Equal
- `!=` : Not Equal
- `===` : Matched (Strict equality)
- `!==` : Not Matched (Strict inequality)
- `>` : Greater Than
- `<` : Less Than
- `>=` : Greater Than or Equal
- `<=` : Less Than or Equal

### Example

Here is an example demonstrating how to use `dependencies` in your PHP configuration. The second field will only be visible if the first toggle field is enabled:

```php
[
    'fieldType'     => 'toggle',
    'name'          => 'has_archive',
    'fieldLabel'    => __('Has Archive', 'native-custom-fields'),
    'fieldHelpText' => __('Enables post type archives.', 'native-custom-fields'),
    'default'       => false
],
[
    'fieldType'     => 'text',
    'name'          => 'has_archive_custom_slug',
    'fieldLabel'    => __('Archive Custom Slug', 'native-custom-fields'),
    'fieldHelpText' => __('Set a custom slug for post type archive. Default is post type slug.', 'native-custom-fields'),
    'dependencies'  => [
        'relation'   => 'and',
        'conditions' => [
            [
                'field'    => 'has_archive',
                'operator' => '==',
                'value'    => true
            ]
        ]
    ]
]
```

### Multiple Conditions Example

You can also define multiple conditions and change the `relation` to `'or'` so the field shows if **any** of the conditions are met:

```php
'dependencies' => [
    'relation'   => 'or',
    'conditions' => [
        [
            'field'    => 'fieldType',
            'operator' => '===',
            'value'    => 'select'
        ],
        [
            'field'    => 'fieldType',
            'operator' => '===',
            'value'    => 'radio'
        ]
    ]
]
```
