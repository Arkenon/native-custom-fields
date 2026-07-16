## 7. Creating Options Pages

Native Custom Fields allows you to register options pages to set plugin or theme settings.

1. Navigate to *Native Custom Fields > Options Pages* in your sidebar.
2. Click the *Create Options Page* button.
3. *Basic Settings:* Enter the `"Menu Slug"` (e.g., `my-plugin-settings`) and the `"Menu Title"` (e.g., `My Plugin Settings`).
4. *Slug:* The system will automatically generate a slug, but you can customize it (e.g., `my-plugin-settings`).
5. *Advanced Options:* Choose the `"Parent Slug"`, `"Icon"`, and other options.
6. Click *Save Options Page*. Your new options page will now appear in the WordPress sidebar menu.

### Options Page Fields ###

Options Pages allow you to create global settings panels for your plugin or theme. The fields here are not attached to a specific post or user, but are saved globally. Just like Term Meta and User Meta, fields on Options Pages are grouped by **Sections**.

1. **Add a Section**: Navigate to the Edit Options Page screen. Start by creating a section to group related settings by clicking the **Add Section** button at the top right.
2. **Configure Section**: Provide the necessary details for your Section in the settings panel, like the Title and Icon.
3. **Add Fields**: Click the **+** button within the Section in the List View to add individual settings fields (e.g., Toggle for enabling features, Text Control for API keys).
4. **Save**: Click **Save Changes** at the bottom. The configuration will generate a global settings page where administrators can manage these options.

---
