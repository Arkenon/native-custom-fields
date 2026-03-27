## 5) Request Flow (Admin UI -> REST -> Service -> Storage)

For builder operations, the plugin follows this flow:

1. Admin UI sends data to plugin REST endpoints.
2. Controllers validate/sanitize request payloads.
3. Services transform and validate configuration structures.
4. Repositories persist configurations to `wp_options` (`update_option`) and runtime values to native meta APIs.

Main controller files:
- `includes/Presentation/Admin/Controllers/PostMetaController.php`
- `includes/Presentation/Admin/Controllers/TermMetaController.php`
- `includes/Presentation/Admin/Controllers/UserMetaController.php`
- `includes/Presentation/Admin/Controllers/OptionsController.php`

---
