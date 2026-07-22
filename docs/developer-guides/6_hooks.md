## 6) Hooks

This plugin relies on standard WordPress lifecycle hooks (`register_activation_hook`, `register_deactivation_hook`, `plugins_loaded`, `init`) and also exposes custom action/filter hooks for extension.

### 6.1 Lifecycle Hooks (General)

- **WordPress activation hook:** `register_activation_hook()` is registered in `native-custom-fields.php` and calls `ActivationService::activate()`.
- **Custom activation action:** `native_custom_fields_activation` is fired in `includes/Services/ActivationService.php` when the plugin is activated.
- **WordPress deactivation hook:** `register_deactivation_hook()` is registered in `native-custom-fields.php` and calls `DeactivationService::deactivate()`.
- **Custom deactivation action:** `native_custom_fields_deactivation` is fired in `includes/Services/DeactivationService.php` when the plugin is deactivated.
- **Initialization flow:** In `includes/App.php`, services are initialized on `plugins_loaded` and controllers on `init` (priority `5`).
- **Custom init actions:** `native_custom_fields_before_init` and `native_custom_fields_after_init` are fired in `App::run()`.

### 6.2 Action Hooks

#### `native_custom_fields_save_options_before`
- **Location:** `includes/Services/OptionService.php`
- **When it runs:** Before an Options Page form is saved (except reset flow).
- **Arguments:** `$menu_slug`, `$values`
- **Use case:** Validate/transform settings, trigger side effects, or sync data before persistence.

#### `native_custom_fields_save_options_after`
- **Location:** `includes/Services/OptionService.php`
- **When it runs:** After save operation completes (except reset flow).
- **Arguments:** `$response` (`ResponseModel`)
- **Use case:** Logging, admin notifications, external integration callbacks after save.

### 6.3 Filter Hooks

#### Core bootstrap and admin integration
- `native_custom_fields_services` (`includes/App.php`): Extend the service class list loaded by DI.
- `native_custom_fields_controllers` (`includes/Presentation/ControllerInit.php`): Extend the controller class list.
- `native_custom_fields_localize_data` (`includes/Presentation/Admin/Controllers/AdminController.php`): Modify localized JS payload before `wp_localize_script`.

#### Builder UI and field registry
- `native_custom_fields_container_types` (`includes/Services/FieldService.php`): Extend available container types (for example `section`, `meta_box`).
- `native_custom_fields_field_types` (`includes/Services/FieldService.php`): Extend field type palette used by builders.
- `native_custom_fields_dashboard_items` (`includes/Services/FieldService.php`): Add/change dashboard cards in plugin admin home.

#### Options Pages
- `native_custom_fields_options_pages` (`includes/Services/OptionService.php`): Modify options page definitions loaded from configuration.
- `native_custom_fields_options_page_fields` (`includes/Services/OptionService.php`): Modify options page field sections before rendering; receives sections and `$menu_slug`.

#### Post Types and Post Meta
- `native_custom_fields_post_types` (`includes/Services/PostMetaService.php`): Modify post type configurations before registration.
- `native_custom_fields_post_meta_fields` (`includes/Services/PostMetaService.php`): Modify post meta field configuration map by post type.
- `native_custom_fields_register_post_meta_type` (`includes/Services/PostMetaService.php`): Set/override the post meta `type` before `register_post_meta`.
- `native_custom_fields_register_post_meta_args` (`includes/Services/PostMetaService.php`): Override registration args (commonly `single` and `show_in_rest`) before `register_post_meta`.

#### Taxonomies and Term Meta
- `native_custom_fields_taxonomies` (`includes/Services/TermMetaService.php`): Modify taxonomy configurations before registration.
- `native_custom_fields_term_meta_fields` (`includes/Services/TermMetaService.php`): Modify term meta field configuration map by taxonomy.
- `native_custom_fields_register_term_meta_type` (`includes/Services/TermMetaService.php`): Set/override the term meta `type` before `register_term_meta`.
- `native_custom_fields_register_term_meta_args` (`includes/Services/TermMetaService.php`): Override registration args (commonly `single` and `show_in_rest`) before `register_term_meta`.

#### User Meta
- `native_custom_fields_user_meta_fields` (`includes/Services/UserMetaService.php`): Modify user meta field configuration before rendering/saving (currently centered on `all_users`).

### 6.4 Quick Example

```php
add_action( 'native_custom_fields_save_options_before', function( $menu_slug, $values ) {
    if ( 'my_site_options' === $menu_slug ) {
        // Custom pre-save logic.
    }
}, 10, 2 );

add_filter( 'native_custom_fields_register_post_meta_type', function( $type, $meta_key, $post_type ) {
    if ( 'book' === $post_type && 'price' === $meta_key ) {
        return 'number';
    }
    return $type;
}, 10, 3 );

add_filter( 'native_custom_fields_register_post_meta_args', function( $args, $meta_key, $post_type ) {
    if ( 'book' === $post_type && 'internal_notes' === $meta_key ) {
        $args['single'] = true;
        $args['show_in_rest'] = false;
    }
    return $args;
}, 10, 3 );
```

### 6.5 Best Practices

1. **Always set accepted args correctly**
   - If a hook passes multiple parameters, set the 4th argument in `add_action()` / `add_filter()`.

```php
add_filter( 'native_custom_fields_options_page_fields', function( $sections, $menu_slug ) {
    if ( 'my_site_options' !== $menu_slug ) {
        return $sections;
    }

    // Modify sections for this page only.
    return $sections;
}, 10, 2 );
```

2. **Scope your logic by slug/key**
   - Avoid changing all post types or all options pages unless that is intentional.

```php
add_filter( 'native_custom_fields_post_types', function( $post_types ) {
    if ( isset( $post_types['book']['args'] ) ) {
        $post_types['book']['args']['show_in_rest'] = true;
    }
    return $post_types;
} );
```

3. **Validate and sanitize before side effects**
   - `native_custom_fields_save_options_before` is the right place to validate payload shape.

```php
add_action( 'native_custom_fields_save_options_before', function( $menu_slug, $values ) {
    if ( 'my_site_options' !== $menu_slug ) {
        return;
    }

    $email = isset( $values['contact_email'] ) ? sanitize_email( $values['contact_email'] ) : '';
    if ( $email && ! is_email( $email ) ) {
        // Example: log or notify; do not trust raw payload.
    }
}, 10, 2 );
```

4. **Prefer additive extension, not destructive replacement**
   - For lists (`services`, `controllers`, `field_types`, `dashboard_items`), append items instead of wiping the existing array.

```php
add_filter( 'native_custom_fields_dashboard_items', function( $items ) {
    $items[] = [
        'label'       => __( 'My Module', 'my-textdomain' ),
        'description' => __( 'Custom integration entry.', 'my-textdomain' ),
        'icon'        => 'admin-tools',
        'page'        => 'my-custom-page',
    ];
    return $items;
} );
```

5. **Use priorities intentionally**
   - Run earlier (`<10`) to prepare data, later (`>10`) to override data from other plugins.

```php
add_filter( 'native_custom_fields_register_term_meta_type', function( $type, $meta_key, $taxonomy ) {
    if ( 'genre' === $taxonomy && 'priority' === $meta_key ) {
        return 'number';
    }
    return $type;
}, 20, 3 );

add_filter( 'native_custom_fields_register_term_meta_args', function( $args, $meta_key, $taxonomy ) {
    if ( 'genre' === $taxonomy && 'editor_note' === $meta_key ) {
        $args['single'] = true;
        $args['show_in_rest'] = false;
    }
    return $args;
}, 20, 3 );
```

6. **Defensive checks for optional structures**
   - Configuration arrays can be modified by multiple plugins; guard with `isset()` and `is_array()`.

```php
add_filter( 'native_custom_fields_term_meta_fields', function( $configs ) {
    if ( ! isset( $configs['genre']['sections'] ) || ! is_array( $configs['genre']['sections'] ) ) {
        return $configs;
    }

    // Safe mutation.
    return $configs;
} );
```

---
