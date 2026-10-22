## 1) Configuration Storage (wp_options)

All builder-level configurations are stored in the `wp_options` table. When creating a new custom post type, custom taxonomy, custom user meta, or custom options page, the configuration is stored in the `wp_options` table.

### 1.1 Post Type Builder

When you create a new custom post type, the configuration is stored in the `wp_options` table with the key `native_custom_fields_post_types_config`. The value is serialized array that contains the configuration of the custom post type.

- **Option key:** `native_custom_fields_post_types_config`
- **Contains:** Custom Post Type definitions and registration args.
- **Related service/controller:**
  - `includes/Services/PostMetaService.php`
  - `includes/Presentation/Admin/Controllers/PostMetaController.php`

### 1.2 Post Meta Builder

When you create a new custom post type, the configuration is stored in the `wp_options` table with the key `native_custom_fields_post_meta_fields_config`. The value is serialized array that contains the configuration of the custom post type.

- **Option key:** `native_custom_fields_post_meta_fields_config`
- **Contains:** Field group/section/meta box definitions attached to post types.
- **Related service/controller:**
  - `includes/Services/PostMetaService.php`
  - `includes/Presentation/Admin/Controllers/PostMetaController.php`

### 1.3 Taxonomy Builder

When you create a new custom taxonomy, the configuration is stored in the `wp_options` table with the key `native_custom_fields_taxonomies_config`. The value is serialized array that contains the configuration of the custom taxonomy.

- **Option key:** `native_custom_fields_taxonomies_config`
- **Contains:** Custom taxonomy definitions and registration args.
- **Related service/controller:**
  - `includes/Services/TermMetaService.php`
  - `includes/Presentation/Admin/Controllers/TermMetaController.php`

### 1.4 Term Meta Builder

When you create a new custom taxonomy, the configuration is stored in the `wp_options` table with the key `native_custom_fields_term_meta_fields_config`. The value is serialized array that contains the configuration of the custom taxonomy.

- **Option key:** `native_custom_fields_term_meta_fields_config`
- **Contains:** Section and field definitions attached to taxonomies.
- **Related service/controller:**
  - `includes/Services/TermMetaService.php`
  - `includes/Presentation/Admin/Controllers/TermMetaController.php`

### 1.5 User Meta Builder

When you create a new custom taxonomy, the configuration is stored in the `wp_options` table with the key `native_custom_fields_user_meta_fields_config`. The value is serialized array that contains the configuration of the custom taxonomy.

- **Option key:** `native_custom_fields_user_meta_fields_config`
- **Contains:** Section and field definitions for user profile pages.
- **Related service/controller:**
  - `includes/Services/UserMetaService.php`
  - `includes/Presentation/Admin/Controllers/UserMetaController.php`

### 1.6 Options Pages Builder

When you create a new options page, the configuration is stored in the `wp_options` table with the key `native_custom_fields_options_pages_config`. The value is serialized array that contains the configuration of the custom options page.

- **Option keys:**
  - `native_custom_fields_options_pages_config` (page definitions)
  - `native_custom_fields_options_pages_fields_config` (field/section definitions per options page)
- **Contains:** Options page menu config and field schema.
- **Related service/controller:**
  - `includes/Services/OptionService.php`
  - `includes/Presentation/Admin/Controllers/OptionsController.php`

### 1.7 Builder State

The options above are what runs on the site (post type registration, meta boxes, options pages). The builder screens do not read them. Each builder screen loads its form values from a separate **builder state** option, written next to the configuration on every save:

| Builder screen | Builder state option |
|---|---|
| Post Type Builder | `native_custom_fields_post_type_builder_{post_type}` |
| Post Meta Fields | `native_custom_fields_post_meta_fields_builder_{post_type}` |
| Taxonomy Builder | `native_custom_fields_taxonomy_builder_{taxonomy}` |
| Term Meta Fields | `native_custom_fields_term_meta_fields_builder_{taxonomy}` |
| User Meta Fields | `native_custom_fields_user_meta_fields_builder_{user_role}` (`all_users`) |
| Options Page | `native_custom_fields_options_page_builder_{menu_slug}` |
| Options Page Fields | `native_custom_fields_options_page_fields_builder_{menu_slug}` |

If the configuration exists but its builder state does not, the item works at runtime but its builder screen opens empty.

**Import / Export:** The export file carries the builder states of the exported items under the `builder_states` key, keyed by option name. On import, each imported item gets its builder state back: from `builder_states` when the file has it, otherwise rebuilt from the imported configuration. This covers files exported before `builder_states` was added. Re-importing such a file repairs the builder screens of a site that was imported earlier. Only the builder state options of the imported items are written.

---