=== Native Custom Fields ===
Contributors: arkenon
Tags: custom fields, custom post type, meta fields, options page, gutenberg, block editor, developer tools
Requires at least: 6.0
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Custom Content Types and Meta Fields built with WordPress native components. Modern, clean, and performance-focused.

== Description ==

Native Custom Fields is a modern WordPress plugin for creating custom content types, meta fields, and options pages using WordPress’ own native component system.

Instead of shipping a proprietary UI framework or custom database structure, Native Custom Fields leverages WordPress core technologies such as:

- @wordpress/components
- @wordpress/data
- @wordpress/elements
- Block Editor architecture

This ensures a seamless, future-proof experience that evolves together with WordPress core.

= Why Native Custom Fields? =

Most custom field plugins introduce their own UI systems, internal data storage layers, or hidden configuration post types.

Native Custom Fields follows a different philosophy:

• Uses WordPress native UI components
• Stores configuration in wp_options
• Stores data in postmeta, termmeta, and usermeta
• Does not create unnecessary database tables
• Does not register hidden configuration post types
• Follows WordPress coding standards

The result is a clean, lightweight, and maintainable solution.

= Key Features =

= Content Types =
* Register Custom Post Types
* Register Custom Taxonomies

= Meta Fields =
Create field groups and attach them to:
* Post Types
* Taxonomies
* User Profiles
* Options Pages (Pro)

= Supported Components =
* Input Control
* Text Control
* Number Control
* Select Control
* Checkbox Control
* Radio Control
* Textarea Control
* Range Control
* Toggle Control
* Color Picker
* Color Palette
* Date Picker
* DateTime Picker
* Time Picker
* Unit Control
* Angle Picker Control
* Alignment Matrix Control
* Border Box Control
* Border Control
* Box Control
* Toggle Group Control
* Combobox Field
* Font Size Picker
* File Upload
* Media Library
* Form Token
* ExternalLink
* Heading
* Notice
* Text Highlight

Custom Components:
* Repeater (Pro)
* Group (Pro)

= Developer-Friendly =
* Built with PSR-4 autoloading
* Strict Types compatible
* Modern React-based admin UI
* Clean and extendable architecture
* Import / Export via JSON or PHP (Pro)

= Performance-Focused =
* Minimum admin UI bloat
* Native WordPress components
* No redundant database tables
* Optimized for long-term maintainability

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/native-custom-fields`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Start creating Custom Content Types and Field Groups from the admin panel

== Frequently Asked Questions ==

= Who is this plugin for? =

Native Custom Fields is built primarily for WordPress developers, agencies, and advanced users who want full control over structured data while staying aligned with WordPress core standards.

= How is this different from other custom field plugins? =

Native Custom Fields uses WordPress’ official component system instead of a custom-built admin UI framework.
It follows WordPress data architecture and avoids unnecessary database layers.

= Does it create custom database tables? =

No. Configuration is stored in wp_options, and data is stored in standard WordPress meta tables.

= Is it compatible with the Block Editor? =

Yes. The plugin is built around the Block Editor architecture and uses native WordPress components.

== Changelog ==

= 1.0.0 =
* Initial public release
* Custom Post Types support
* Taxonomies support
* Field Groups and Meta Fields
* Options Pages
* Import / Export system
* Modern native admin UI

== Credits ==

Built using official WordPress packages:

* @wordpress/scripts
* @wordpress/components
* @wordpress/elements
* @wordpress/icons
* @wordpress/data

== Developers ==

If you want to contribute to the plugin:
1) Download the source code and run `npm install` to install the development dependencies.
2) To install composer dependencies, run `composer install`.
3) Run `npm start` to start the development server.
4) To build the plugin, run `npm run build`.