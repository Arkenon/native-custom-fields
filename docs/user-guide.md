> This is a comprehensive, professional documentation guide for Native Custom Fields, structured specifically for standard users and site administrators.

# Native Custom Fields Documentation

Welcome to the official documentation for *Native Custom Fields*. This guide is designed to help you get started with the plugin, from installation to creating complex data structures using WordPress's native interface components.

---

## Part 1: User Guide

### Introduction

Native Custom Fields is a next-generation WordPress plugin that allows you to create Custom Post Types, Taxonomies, and Field Groups using the same native React components that power the WordPress Block Editor. Unlike other plugins that add heavy custom styles to your dashboard, this plugin stays lightweight and performance-focused.

---

### 1. How to Download and Install

To begin using Native Custom Fields, follow these steps:

1. *Download:* You can download the latest stable version of the plugin from the [Official WordPress Plugin Repository](https://wordpress.org/plugins/) or the official website.
2. *Upload:* Navigate to your WordPress Admin Dashboard, go to *Plugins > Add New*, and click *Upload Plugin*. Select the `.zip` file you downloaded.
3. *Installation:* Alternatively, search for `"Native Custom Fields"` in the Add New plugin screen and click *Install Now*.
4. *Activation:* Once installed, click the *Activate* button to enable the plugin features on your site.

---

### 2. Creating Your First Custom Post Type

Native Custom Fields allows you to register new content types (like Portfolio, Testimonials, or Products) without writing code.

1. Navigate to *Native Custom Fields > Post Types* in your sidebar.
2. Click the *Add New Post Type* button.
3. *Basic Settings:* Enter the `"Singular Label"` (e.g., `Book`) and the `"Plural Label"` (e.g., `Books`).
4. *Slug:* The system will automatically generate a slug, but you can customize it (e.g., `my-portfolio`).
5. *Advanced Options:* Choose which features the post type should support, such as a Title, Editor, Featured Image, or Excerpts.
6. Click *Save Post Type*. Your new content type will now appear in the WordPress sidebar menu.

---

### 3. Adding Meta Fields to Post Types

Once you have a Post Type, you can add structured data fields to it.

1. Go to *Native Custom Fields > Field Groups*.
2. Click *Add New Field Group*.
3. *Location Rules:* Select the Post Type where you want these fields to appear (e.g., `"Show this group if Post Type is equal to Book"`).
4. *Add Fields:* Use the Field Palette to drag and drop native WordPress components like:
   - *Text Control:* For short titles or names.
   - *Media Library:* For selecting images or files directly from your library.
   - *Color Picker:* For brand or UI colors.
   - *Date/Time Picker:* For scheduling or event dates.
5. *Configure:* Click each field to set its *Label*, *Name (Meta Key)*, and *Description*.
6. *Save:* Click *Publish* to make the fields active in the editor.

---

### 4. Creating Custom Taxonomies

Taxonomies are used to categorize your content (like "Genres" for Books).

1. Go to *Native Custom Fields > Taxonomies*.
2. Click *Add New Taxonomy*.
3. Enter the *Labels* and *Slug* for your taxonomy.
4. *Attach to Post Type:* Select which post types should use this taxonomy.
5. *Hierarchical:* Check this if you want it to behave like "Categories" (parent/child relationship) or leave it unchecked for "Tags."
6. Click *Save Taxonomy*.

---

### 5. Adding Fields to Taxonomies

You can also add custom metadata to your category or tag pages.

1. Create a new *Field Group*.
2. In the *Location* settings, choose *Taxonomy* and select your specific taxonomy (e.g., `Category` or `Genre`).
3. Add your fields (e.g., a "Category Icon" using the *Media Library* field).
4. When you edit a term within that taxonomy, your custom fields will appear at the bottom of the page.

---

### 6. Adding User Meta Fields

Need to add a "Twitter Profile" or "Biography Image" to user accounts?

1. Create a new *Field Group*.
2. Set the *Location* to *User Profile*.
3. Add the desired fields (e.g., *Text Control* for social links).
4. Go to *Users > Profile* or *Users > Edit*. You will find your custom fields integrated into the profile settings.
