# Native Custom Fields Developer Guide

This guide explains how Native Custom Fields stores and serves configuration and runtime data, and how developers can retrieve that data using native WordPress APIs.

## Chapters

### [1) Configuration Storage](1_configuration_storage.md)
Explains how builder-level configurations (Post Types, Meta Fields, Taxonomies, etc.) are stored in the `wp_options` table.

### [2) Runtime Data Storage](2_runtime_data_storage.md)
Details where user-entered data is stored in native WordPress tables (`wp_options`, `wp_postmeta`, `wp_termmeta`, `wp_usermeta`).

### [3) Accessing Data](3_accessing_data.md)
Provides examples of how to retrieve metadata using native WordPress functions like `get_post_meta()`, `get_term_meta()`, and `get_user_meta()`.

### [4) Options Page Storage](4_options_page_storage.md)
Explains how Options Page data is stored as a single serialized option in `wp_options` and how to retrieve it.

### [5) Request Flow](5_request_flow.md)
Describes the data flow from Admin UI through REST API endpoints and Services to the database.

### [6) Hooks](6_hooks.md)
A comprehensive list of action and filter hooks available for extending the plugin's functionality.

### [7) Practical Notes](7_practical_notes.md)
Best practices and key takeaways for developers working with Native Custom Fields.
