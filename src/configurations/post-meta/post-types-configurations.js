import {__} from "@wordpress/i18n";

export const postTypesConfigurations = [
    {
        section_name: 'native_custom_fields_create_post_type_general',
        section_title: __('General', 'native-custom-fields'),
        section_icon: 'info',
        fields: [
            {
                fieldType: 'text',
                name: 'post_type',
                fieldLabel: __('Post Type Slug', 'native-custom-fields'),
                fieldHelpText: __('Post type key. Must not exceed 20 characters and may only contain lowercase alphanumeric characters, dashes, and underscores.', 'native-custom-fields'),
                required: true,
                placeholder: 'book'
            },
            {
                fieldType: 'text',
                name: 'label',
                fieldLabel: __('Label', 'native-custom-fields'),
                fieldHelpText: __('Name of the post type shown in the menu. Usually plural.', 'native-custom-fields'),
                placeholder: 'Books',
                required: true
            },
            {
                fieldType: 'text',
                name: 'singular_name',
                fieldLabel: __('Singular Name', 'native-custom-fields'),
                fieldHelpText: __('Name for one object of this post type.', 'native-custom-fields'),
                placeholder: 'Book',
                required: true
            },
            {
                fieldType: 'text',
                name: 'description',
                fieldLabel: __('Description', 'native-custom-fields'),
                fieldHelpText: __('A short descriptive summary of what the post type is.', 'native-custom-fields'),
                placeholder: 'A collection of books...',
            },
            {
                fieldType: 'number',
                name: 'menu_position',
                fieldLabel: __('Menu Position', 'native-custom-fields'),
                fieldHelpText: __('The position in the menu order the post type should appear. Default null (at the bottom).', 'native-custom-fields'),
                placeholder: '60',
            },
            {
                fieldType: 'text',
                name: 'menu_icon',
                fieldLabel: __('Menu Icon', 'native-custom-fields'),
                fieldHelpText: __('The dashicon to use for the menu icon. See: https://developer.wordpress.org/resource/dashicons/', 'native-custom-fields'),
                placeholder: 'dashicons-book'
            },
            {
                fieldType: 'toggle',
                name: 'has_archive',
                fieldLabel: __('Has Archive', 'native-custom-fields'),
                fieldHelpText: __('Enables post type archives.', 'native-custom-fields'),
                default: false
            },
            {
                fieldType: 'text',
                name: 'has_archive_custom_slug',
                fieldLabel: __('Archive Custom Slug', 'native-custom-fields'),
                fieldHelpText: __('Set a custom slug for post type archive. Default is post type slug.', 'native-custom-fields'),
				dependencies: {
					relation: 'and',
					conditions: [
						{
							field: 'has_archive',
							operator: '==',
							value: true
						}
					]
				},
            },
            {
                fieldType: 'toggle',
                name: 'query_var',
                fieldLabel: __('Query Var', 'native-custom-fields'),
                fieldHelpText: __('Sets the query_var key for this post type.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'text',
                name: 'query_var_custom_slug',
                fieldLabel: __('Query Var Custom Slug', 'native-custom-fields'),
                fieldHelpText: __('Set a custom slug for post type query variable. Default is post type slug.', 'native-custom-fields'),
                placeholder: 'my_slug',
				dependencies: {
					relation: 'and',
					conditions: [
						{
							field: 'query_var',
							operator: '==',
							value: true
						}
					]
				},
            },
            {
                fieldType: 'select',
                name: 'supports',
                fieldLabel: __('Supports', 'native-custom-fields'),
                fieldHelpText: __('Core features the post type supports.', 'native-custom-fields'),
                multiple: true,
                options: [
                    {label: __('Title', 'native-custom-fields'), value: 'title'},
                    {label: __('Editor', 'native-custom-fields'), value: 'editor'},
                    {label: __('Excerpt', 'native-custom-fields'), value: 'excerpt'},
                    {label: __('Author', 'native-custom-fields'), value: 'author'},
                    {label: __('Thumbnail', 'native-custom-fields'), value: 'thumbnail'},
                    {label: __('Comments', 'native-custom-fields'), value: 'comments'},
                    {label: __('Trackbacks', 'native-custom-fields'), value: 'trackbacks'},
                    {label: __('Revisions', 'native-custom-fields'), value: 'revisions'},
                    {label: __('Custom Fields', 'native-custom-fields'), value: 'custom-fields'},
                    {label: __('Page Attributes', 'native-custom-fields'), value: 'page-attributes'},
                    {label: __('Post Formats', 'native-custom-fields'), value: 'post-formats'}
                ],
                default: ['title', 'editor', 'excerpt', 'comments', 'author', 'thumbnail', 'custom-fields']
            },
            {
                fieldType: 'token_field',
                name: 'taxonomies',
                fieldLabel: __('Taxonomies', 'native-custom-fields'),
                fieldHelpText: __('Taxonomies to register for the post type.', 'native-custom-fields'),
                maxLength: 3,
                suggestions: ['category', 'post_tag', 'post_format'],
                allowOnlySuggestions: true,
                __experimentalExpandOnFocus: true,
                __experimentalAutoSelectFirstMatch: true,
            },
            {
                fieldType: 'toggle',
                name: 'map_meta_cap',
                fieldLabel: __('Map Meta Cap', 'native-custom-fields'),
                fieldHelpText: __('Whether to use the internal default meta capability handling.', 'native-custom-fields'),
                default: true
            },
           /* {
                fieldType: 'text',
                name: 'register_meta_box_cb',
                fieldLabel: __('Register Meta Box Callback', 'native-custom-fields'),
                fieldHelpText: __('Provide a callback function that will be called when setting up the meta boxes for the edit form. ', 'native-custom-fields'),
            },*/
        ]
    },
    {
        section_name: 'native_custom_fields_create_post_type_labels',
        section_title: __('Labels', 'native-custom-fields'),
        section_icon: 'editor-ul',
        fields: [
            {
                fieldType: 'text',
                name: 'add_new',
                fieldLabel: __('Add New', 'native-custom-fields'),
                placeholder: 'Add New'
            },
            {
                fieldType: 'text',
                name: 'menu_name',
                fieldLabel: __('Menu Name', 'native-custom-fields'),
                placeholder: 'Book'
            },
            {
                fieldType: 'text',
                name: 'name_admin_bar',
                fieldLabel: __('Admin Bar Name', 'native-custom-fields'),
                placeholder: 'Book'
            },
            {
                fieldType: 'text',
                name: 'add_new_item',
                fieldLabel: __('Add New Item', 'native-custom-fields'),
                placeholder: 'Add New Book'
            },
            {
                fieldType: 'text',
                name: 'edit_item',
                fieldLabel: __('Edit Item', 'native-custom-fields'),
                placeholder: 'Edit Book'
            },
            {
                fieldType: 'text',
                name: 'new_item',
                fieldLabel: __('New Item', 'native-custom-fields'),
                placeholder: 'New Book'
            },
            {
                fieldType: 'text',
                name: 'view_item',
                fieldLabel: __('View Item', 'native-custom-fields'),
                placeholder: 'View Book'
            },
            {
                fieldType: 'text',
                name: 'view_items',
                fieldLabel: __('View Items', 'native-custom-fields'),
                placeholder: 'View Books'
            },
            {
                fieldType: 'text',
                name: 'all_items',
                fieldLabel: __('All Items', 'native-custom-fields'),
                placeholder: 'All Books'
            },
            {
                fieldType: 'text',
                name: 'search_items',
                fieldLabel: __('Search Items', 'native-custom-fields'),
                placeholder: 'Search Books'
            },
            {
                fieldType: 'text',
                name: 'parent_item_colon',
                fieldLabel: __('Parent Item Colon', 'native-custom-fields'),
                placeholder: 'Parent Book:'
            },
            {
                fieldType: 'text',
                name: 'not_found',
                fieldLabel: __('Not Found', 'native-custom-fields'),
                placeholder: 'No books found'
            },
            {
                fieldType: 'text',
                name: 'not_found_in_trash',
                fieldLabel: __('Not Found in Trash', 'native-custom-fields'),
                placeholder: 'No books found in Trash'
            },
            {
                fieldType: 'text',
                name: 'archives',
                fieldLabel: __('Archives', 'native-custom-fields'),
                placeholder: 'Book Archives'
            },
            {
                fieldType: 'text',
                name: 'attributes',
                fieldLabel: __('Attributes', 'native-custom-fields'),
                placeholder: 'Book Attributes'
            },
            {
                fieldType: 'text',
                name: 'insert_into_item',
                fieldLabel: __('Insert In to Item Text', 'native-custom-fields'),
                placeholder: 'Insert in to book'
            },
            {
                fieldType: 'text',
                name: 'uploaded_to_this_item',
                fieldLabel: __('Uploaded to this Item', 'native-custom-fields'),
                placeholder: 'Uploaded to this book'
            },
            {
                fieldType: 'text',
                name: 'featured_image',
                fieldLabel: __('Featured Image', 'native-custom-fields'),
                placeholder: 'Featured Image'
            },
            {
                fieldType: 'text',
                name: 'set_featured_image',
                fieldLabel: __('Set Featured Image', 'native-custom-fields'),
                placeholder: 'Set featured image'
            },
            {
                fieldType: 'text',
                name: 'remove_featured_image',
                fieldLabel: __('Remove Featured Image', 'native-custom-fields'),
                placeholder: 'Remove featured image'
            },
            {
                fieldType: 'text',
                name: 'use_featured_image',
                fieldLabel: __('Use Featured Image', 'native-custom-fields'),
                placeholder: 'Use as featured image'
            },
            {
                fieldType: 'text',
                name: 'filter_items_list',
                fieldLabel: __('Filter Items List', 'native-custom-fields'),
                placeholder: 'Filter books list'
            },
            {
                fieldType: 'text',
                name: 'items_list_navigation',
                fieldLabel: __('Items List Navigation', 'native-custom-fields'),
                placeholder: 'Books list navigation'
            },
            {
                fieldType: 'text',
                name: 'items_list',
                fieldLabel: __('Items List', 'native-custom-fields'),
                placeholder: 'Books list'
            },
            {
                fieldType: 'text',
                name: 'item_published',
                fieldLabel: __('Item Published', 'native-custom-fields'),
                placeholder: 'Book published'
            },
            {
                fieldType: 'text',
                name: 'item_published_privately',
                fieldLabel: __('Item Published Privately', 'native-custom-fields'),
                placeholder: 'Book published privately'
            },
            {
                fieldType: 'text',
                name: 'item_reverted_to_draft',
                fieldLabel: __('Item Reverted to Draft', 'native-custom-fields'),
                placeholder: 'Book reverted to draft'
            },
            {
                fieldType: 'text',
                name: 'item_scheduled',
                fieldLabel: __('Item Scheduled', 'native-custom-fields'),
                placeholder: 'Book scheduled'
            },
            {
                fieldType: 'text',
                name: 'item_updated',
                fieldLabel: __('Item Updated', 'native-custom-fields'),
                placeholder: 'Book updated'
            }
        ]
    },
    {
        section_name: 'native_custom_fields_create_post_type_visibility',
        section_icon: 'visibility',
        section_title: __('Visibility', 'native-custom-fields'),
        fields: [
            {
                fieldType: 'toggle',
                name: 'public',
                fieldLabel: __('Public', 'native-custom-fields'),
                fieldHelpText: __('Whether a post type is intended for use publicly either via the admin interface or by front-end users.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'toggle',
                name: 'hierarchical',
                fieldLabel: __('Hierarchical', 'native-custom-fields'),
                fieldHelpText: __('Whether the post type is hierarchical (e.g. page).', 'native-custom-fields'),
                default: false
            },
            {
                fieldType: 'toggle',
                name: 'exclude_from_search',
                fieldLabel: __('Exclude from Search', 'native-custom-fields'),
                fieldHelpText: __('Whether to exclude posts with this post type from front end search results.', 'native-custom-fields'),
                default: false
            },
            {
                fieldType: 'toggle',
                name: 'publicly_queryable',
                fieldLabel: __('Publicly Queryable', 'native-custom-fields'),
                fieldHelpText: __('Whether queries can be performed on the front end for the post type as part of request. ', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'toggle',
                name: 'show_ui',
                fieldLabel: __('Show UI', 'native-custom-fields'),
                fieldHelpText: __('Whether to generate and allow a UI for managing this post type in the admin.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'toggle',
                name: 'show_in_menu',
                fieldLabel: __('Show in Menu', 'native-custom-fields'),
                fieldHelpText: __('Where to show the post type in the admin menu.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'toggle',
                name: 'show_in_nav_menus',
                fieldLabel: __('Show in Navigation Menus', 'native-custom-fields'),
                fieldHelpText: __('Makes this post type available for selection in navigation menus.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'toggle',
                name: 'show_in_admin_bar',
                fieldLabel: __('Show in Admin Bar', 'native-custom-fields'),
                fieldHelpText: __('Makes this post type available via the admin bar.', 'native-custom-fields'),
                default: true
            },
        ]
    },
    {
        section_name: 'native_custom_fields_create_post_type_capabilities',
        section_icon: 'superhero-alt',
        section_title: __('Capabilities', 'native-custom-fields'),
        fields: [
            {
                fieldType: 'token_field',
                name: 'capability_type',
                fieldLabel: __('Capability Type', 'native-custom-fields'),
                fieldHelpText: __('The string to use to build the read, edit, and delete capabilities. You can add custom singular and plural slugs. e.g. "book", "books" Default is "post"', 'native-custom-fields'),
                maxLength: 2,
                default: ['post']
            },
            {
                fieldType: 'toggle',
                name: 'can_export',
                fieldLabel: __('Can Export', 'native-custom-fields'),
                fieldHelpText: __('Whether to allow this post type to be exported.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'toggle',
                name: 'delete_with_user',
                fieldLabel: __('Delete with User', 'native-custom-fields'),
                fieldHelpText: __('Whether to delete posts of this type when deleting a user.', 'native-custom-fields'),
                default: false
            },
        ]
    },
    {
        section_name: 'native_custom_fields_create_post_type_rest_api',
        section_icon: 'rest-api',
        section_title: __('Rest API', 'native-custom-fields'),
        fields: [
            {
                fieldType: 'toggle',
                name: 'show_in_rest',
                fieldLabel: __('Show in REST API', 'native-custom-fields'),
                fieldHelpText: __('Whether to include the post type in the REST API.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'text',
                name: 'rest_base',
                fieldLabel: __('REST API Base', 'native-custom-fields'),
                fieldHelpText: __('To change the base URL of REST API route. Default is post type slug.', 'native-custom-fields'),
                placeholder: 'book'
            },
            {
                fieldType: 'text',
                name: 'rest_namespace',
                fieldLabel: __('REST API Namespace', 'native-custom-fields'),
                fieldHelpText: __('To change the namespace URL of REST API route.', 'native-custom-fields'),
                default: 'wp/v2'
            },
            {
                fieldType: 'text',
                name: 'rest_controller_class',
                fieldLabel: __('REST Controller Class', 'native-custom-fields'),
                fieldHelpText: __('REST API Controller class name.', 'native-custom-fields'),
                default: 'WP_REST_Posts_Controller'
            },
            {
                fieldType: 'text',
                name: 'autosave_rest_controller_class',
                fieldLabel: __('REST Controller Class', 'native-custom-fields'),
                fieldHelpText: __('REST API Autosave Controller class name.', 'native-custom-fields'),
                default: 'WP_REST_Autosaves_Controller'
            },
            {
                fieldType: 'text',
                name: 'revisions_rest_controller_class',
                fieldLabel: __('REST Controller Class', 'native-custom-fields'),
                fieldHelpText: __('REST API Revisions Controller class name.', 'native-custom-fields'),
                default: 'WP_REST_Revisions_Controller'
            },
        ]
    },
    {
        section_name: 'native_custom_fields_create_post_type_permalinks',
        section_icon: 'admin-links',
        section_title: __('Permalinks', 'native-custom-fields'),
        fields: [
            {
                fieldType: 'toggle',
                name: 'rewrite',
                fieldLabel: __('Rewrite Permalinks', 'native-custom-fields'),
                fieldHelpText: __('Triggers the handling of rewrites for this post type. To prevent rewrites, set to false. Default: true and use post type slug.', 'native-custom-fields'),
                default: true
            },
            {
                fieldType: 'group',
                name: 'rewrite_settings',
                fieldLabel: __('Rewrite Settings', 'native-custom-fields'),
                fieldHelpText: __('Advanced rewrite settings.', 'native-custom-fields'),
				dependencies: {
					relation: 'and',
					conditions: [
						{
							field: 'rewrite',
							operator: '==',
							value: true
						}
					]
				},
                fields: [
                    {
                        fieldType: 'text',
                        name: 'slug',
                        fieldLabel: __('Permalink Slug', 'native-custom-fields'),
                        fieldHelpText: __('Customize the permalink structure slug. Defaults to the post type slug or has_archive custom slug.', 'native-custom-fields'),
                        placeholder: 'my-slug',
                    },
                    {
                        fieldType: 'toggle',
                        name: 'with_front',
                        fieldLabel: __('With Front', 'native-custom-fields'),
                        fieldHelpText: __('Should the permalink structure be prepended with the front base.', 'native-custom-fields'),
						default: true
                    },
                    {
                        fieldType: 'toggle',
                        name: 'feeds',
                        fieldLabel: __('Feeds', 'native-custom-fields'),
                        fieldHelpText: __('Should a feed permalink structure be built for this post type.', 'native-custom-fields'),
						default: false
                    },
                    {
                        fieldType: 'toggle',
                        name: 'pages',
                        fieldLabel: __('Pages', 'native-custom-fields'),
                        fieldHelpText: __('Should the permalink structure provide for pagination.', 'native-custom-fields'),
						default: true
                    },
                    {
                        fieldType: 'text',
                        name: 'ep_mask',
                        fieldLabel: __('EP Mask', 'native-custom-fields'),
                        fieldHelpText: __('Assign an endpoint mask for this post type.', 'native-custom-fields'),
						default: 'EP_PERMALINK'
                    }
                ]
            },
        ]
    },
    {
        section_name: 'native_custom_fields_create_post_type_template',
        section_icon: 'format-aside',
        section_title: __('Template', 'native-custom-fields'),
        fields: [
            {
                fieldType: 'toggle',
                name: 'template',
                fieldLabel: __('Use Template', 'native-custom-fields'),
                fieldHelpText: __('Whether to use a template for this post type.', 'native-custom-fields'),
                default: false
            },
            {
                fieldType: 'group',
                name: 'template_config',
                fieldLabel: __('Template Configuration', 'native-custom-fields'),
                fieldHelpText: __('Template blocks configuration.', 'native-custom-fields'),
				dependencies: {
					relation: 'and',
					conditions: [
						{
							field: 'template',
							operator: '==',
							value: true
						}
					]
				},
                default: {
                    template_blocks: '[]',
                    template_lock: false
                },
                fields: [
                    {
                        fieldType: 'textarea',
                        name: 'template_blocks',
                        fieldLabel: __('Template Blocks', 'native-custom-fields'),
                        fieldHelpText: __('JSON array of block objects.', 'native-custom-fields'),
                        placeholder: '[{"name":"core/paragraph","attributes":{"content":"Default content"}}]'
                    },
                    {
                        fieldType: 'toggle',
                        name: 'template_lock',
                        fieldLabel: __('Lock Template', 'native-custom-fields'),
                        fieldHelpText: __('Whether the template should be locked.', 'native-custom-fields'),
                    }
                ]
            }
        ]
    }
];
