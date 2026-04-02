# Getting Started with Components

Native Custom Fields provides a variety of controls (field types) that you can use to build custom meta boxes for posts, terms, users, and options pages. Each component is designed to handle specific types of data and provide a consistent user interface within the WordPress admin area.

## Component Overview

All components share a set of base parameters such as `fieldType`, `name`, `fieldLabel`, and `required`. Depending on the specific control, additional parameters are available to customize its behavior and appearance.

You can register these components using the following hooks:
- `native_custom_fields_post_meta_fields`
- `native_custom_fields_term_meta_fields`
- `native_custom_fields_user_meta_fields`
- `native_custom_fields_options_page_fields`

## Available Components

Below is a list of all available field components. You can find detailed configuration references for each of these in their respective documentation files:

- Alignment Matrix Control
- Border Box Control
- Border Control
- Box Control
- Checkbox Control
- Color Palette Control
- Color Picker Control
- Combobox Control
- Date Picker Control
- Date Time Picker Control
- External Link Control
- File Upload Control
- Font Size Control
- Group Control
- Heading Control
- Input Control
- Media Library Control
- Notice Control
- Number Control
- Radio Control
- Range Control
- Repeater Control
- Select Control
- Text Control
- Text Highlight Control
- Textarea Control
- Time Picker Control
- Toggle Group Control
- Token Field Control
- Unit Control
