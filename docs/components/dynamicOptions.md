## Dynamic Options

The `options` parameter of the `select`, `radio`, `combobox` and `toggle_group` controls accepts
either a fixed list or a `{{token}}` that pulls the choices from WordPress data at render time.

Tokens are resolved in the browser through the WordPress core data package
(`@wordpress/core-data`), which means no extra PHP is needed to populate a field with posts,
users or terms.

### 1) Static Options

Write the choices as `Label : value`, separated by commas:

```php
'options' => 'Option 1 : option_1, Option 2 : option_2',
```

If the `:` part is omitted, the text is used as both the label and the value. An array of
`['label' => ..., 'value' => ...]` items is accepted as well.

### 2) Dynamic Options

A `{{token}}` anywhere in the value switches the field to dynamic mode:

```php
'options' => '{{posts}}',
```

Static text is **ignored** as soon as the value contains a token, so the two cannot be mixed.
Several tokens can be combined and their results are merged into a single list, with duplicates
removed:

```php
'options' => '{{pages}} {{posts?type=book}}',
```

### 3) Available Tokens

| Token | Source | Label | Stored value |
|---|---|---|---|
| `{{posts}}` | Posts | Post title | Post ID |
| `{{pages}}` | Pages | Page title | Page ID |
| `{{users}}` | Users | Display name | User ID |
| `{{categories}}` | Categories | Term name | Term ID |
| `{{tags}}` | Tags | Term name | Term ID |
| `{{menus}}` | Navigation menus | Menu title | Menu ID |
| `{{taxonomies}}` | Registered taxonomies | Taxonomy name | Taxonomy slug |
| `{{post_types}}` | Registered post types | Singular name | Post type slug |

`{{taxonomies}}` returns the list of taxonomies, not the terms inside them. Only category and
tag terms can be listed, through `{{categories}}` and `{{tags}}`.

### 4) Custom Post Types

Use the `type` parameter together with `{{posts}}` and pass the post type slug:

```php
'options' => '{{posts?type=book}}',
'options' => '{{posts?type=product&per_page=50&orderby=title&order=asc}}',
```

`type` is not forwarded to the REST API; it selects which post type is queried. Without it,
`{{posts}}` queries `post` and `{{pages}}` queries `page`.

The post type must be registered with `show_in_rest => true`, otherwise it has no REST endpoint
and the field stays empty.

### 5) Parameters

Everything after `?` is passed to the REST API endpoint backing that token, so any argument the
endpoint supports can be used:

```php
'options' => '{{posts?type=book&per_page=100&status=publish}}',
'options' => '{{users?roles=administrator&per_page=10}}',
'options' => '{{categories?per_page=100&orderby=name&hide_empty=true}}',
'options' => '{{taxonomies?type=post}}',
```

Two arguments are easy to get wrong:

- `roles` (plural) is the users endpoint argument and expects role slugs, not `role`.
- `author` expects a user ID, not a login name: `{{posts?author=5}}`.

### 6) How Many Items Are Returned

The WordPress REST API returns 10 items per request by default and never accepts a `per_page`
above 100. Values such as `per_page=500` or `per_page=-1` are capped at 100 instead of failing
the request. `per_page=all` is accepted as a spelling of the same thing.

That limit makes `select`, `radio` and `toggle_group` unsuitable for large collections: they
render a single page of results and offer no way to reach the rest.

### 7) Searching Large Collections

The `combobox` control searches server side when its options come from a token. What is typed in
the field is sent to the REST API as the `search` argument, so a collection of any size stays
fully reachable regardless of `per_page`:

```php
[
    'fieldType'  => 'combobox',
    'name'       => 'member',
    'fieldLabel' => 'Member',
    'options'    => '{{posts?type=member}}',
]
```

For this control, `per_page` only determines how many entries are listed before anything is
typed; it does not have to cover the whole collection.

The record matching the stored value is fetched separately, so a saved selection keeps its label
even when it falls outside the current search results.

Searching server side applies to `{{posts}}`, `{{pages}}`, `{{users}}`, `{{categories}}`,
`{{tags}}` and `{{menus}}`. `{{taxonomies}}` and `{{post_types}}` return short, complete lists
and are filtered in the browser.

### 8) Token Field Suggestions

The `suggestions` parameter of the `token_field` control is a plain comma-separated list of
strings and does **not** support `{{tokens}}`:

```php
'suggestions' => 'Africa, Europe, Asia',
```
