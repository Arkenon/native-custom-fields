## 3) Accessing Data with Native WordPress Functions

Use standard WordPress APIs to read or write values:

### 3.1 Post Meta
To access post meta values, use `get_post_meta()` function with the following parameters:

`get_post_meta( $post_id, $meta_key, true )`

Example:
```php
$subtitle = get_post_meta( 123, 'book_subtitle', true );
```

### 3.2 Term Meta
To access term meta values, use `get_term_meta()` function with the following parameters:

`get_term_meta( $term_id, $meta_key, true )`

Example:
```php
$term_icon = get_term_meta( 45, 'genre_icon', true );
```

### 3.3 User Meta
To access user meta values, use `get_user_meta()` function with the following parameters:

`get_user_meta( $user_id, $meta_key, true )`

Example:
```php
$twitter = get_user_meta( 7, 'twitter_profile', true );
```

---