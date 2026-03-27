## 4) Options Page Value Storage and Retrieval

When an Options Page form is submitted, all form values for that page are stored as a single option in `wp_options`, using the **options page slug** as the option name.

WordPress handles serialization automatically for arrays/objects.

### Example
If you create an options page:
- **Page name:** `My Site Options`
- **Slug:** `my_site_options`

After saving form values, retrieve all page data with:
```php
$settings = get_option( 'my_site_options', [] );
```

Then access fields from the returned array:
```php
$phone   = $settings['contact_phone'] ?? '';
$logo_id = $settings['site_logo'] ?? 0;
```

---
