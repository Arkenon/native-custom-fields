import {__} from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";


const urlParams = new URLSearchParams(window.location.search);
const step = urlParams.get('step');

const postObjects = ['post', 'page', 'attachment', 'revision', 'nav_menu_item', 'custom_css', 'customize_changeset'];
export const mergedPostObjects = async () => {

	if (step !== 'edit-or-save-taxonomy') {
		return [];
	}

	let postTypeList = [];

	const postTypes = await apiFetch({
		path: '/native-custom-fields/v1/post-meta/get-post-types',
		method: 'GET'
	});

	postTypes.post_type_list.map(postType => {
		const postTypeSlug = postType.post_type_slug;
		postTypeList.push(postTypeSlug)
	});

	return [...postTypeList, ...postObjects];
}

export const taxonomyConfigurations = [
	{
		section_name: 'native_custom_fields_create_taxonomy_general',
		section_title: __('General', 'native-custom-fields'),
		section_icon: 'info',
		fields: [
			{
				fieldType: 'text',
				name: 'taxonomy',
				fieldLabel: __('Taxonomy Slug', 'native-custom-fields'),
				fieldHelpText: __('Taxonomy key. Must not exceed 32 characters and may only contain lowercase alphanumeric characters, dashes, and underscores.', 'native-custom-fields'),
				required: true,
				placeholder: 'book-categories'
			},
			{
				fieldType: 'text',
				name: 'label',
				fieldLabel: __('Label', 'native-custom-fields'),
				fieldHelpText: __('General name for the taxonomy, usually plural. ', 'native-custom-fields'),
				placeholder: 'Book Categories',
				required: true
			},
			{
				fieldType: 'text',
				name: 'singular_name',
				fieldLabel: __('Singular Name', 'native-custom-fields'),
				fieldHelpText: __('Name for one object of this taxonomy.', 'native-custom-fields'),
				placeholder: 'Book Category',
				required: true
			},
			{
				fieldType: 'token_field',
				name: 'object_type',
				fieldLabel: __('Object Type', 'native-custom-fields'),
				fieldHelpText: __('Object type or array of object types with which the taxonomy should be associated.', 'native-custom-fields'),
				suggestions: await mergedPostObjects().then(result => result),
				__experimentalExpandOnFocus: true,
				__experimentalAutoSelectFirstMatch: true,
				required: true
			},
			{
				fieldType: 'text',
				name: 'description',
				fieldLabel: __('Description', 'native-custom-fields'),
				fieldHelpText: __('A short descriptive summary of what the taxonomy is for.', 'native-custom-fields'),
				placeholder: 'A collection of book categories...',
			},
			{
				fieldType: 'toggle',
				name: 'query_var',
				fieldLabel: __('Query Var', 'native-custom-fields'),
				fieldHelpText: __('Sets the query var key for this taxonomy. Default taxonomy slug. If false, a taxonomy cannot be loaded at ?{query_var}={term_slug}. If a string, the query ?{query_var}={term_slug} will be valid.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'text',
				name: 'query_var_custom_slug',
				fieldLabel: __('Query Var Custom Slug', 'native-custom-fields'),
				fieldHelpText: __('Set a custom slug for the taxonomy query variable.', 'native-custom-fields'),
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
				fieldType: 'toggle',
				name: 'default_term',
				fieldLabel: __('Default Term', 'native-custom-fields'),
				fieldHelpText: __('Default term to be used for the taxonomy.', 'native-custom-fields'),
				default: false
			},
			{
				fieldType: 'group',
				name: 'default_term_settings',
				fieldLabel: __('Default Term Settings', 'native-custom-fields'),
				fieldHelpText: __('Set default term settings.', 'native-custom-fields'),
				dependencies: {
					relation: 'and',
					conditions: [
						{
							field: 'default_term',
							operator: '==',
							value: true
						}
					]
				},
				fields: [
					{
						fieldType: 'text',
						name: 'default_term_name',
						fieldLabel: __('Term Name', 'native-custom-fields'),
						placeholder: 'My Term'
					},
					{
						fieldType: 'text',
						name: 'default_term_slug',
						fieldLabel: __('Term Slug', 'native-custom-fields'),
						placeholder: 'my-term'
					},
					{
						fieldType: 'text',
						name: 'default_term_description',
						fieldLabel: __('Term Description', 'native-custom-fields'),
						placeholder: 'A short description of the term'
					},
				]
			},
		]
	},
	{
		section_name: 'native_custom_fields_create_taxonomy_labels',
		section_title: __('Labels', 'native-custom-fields'),
		section_icon: 'editor-ul',
		fields: [
			{
				fieldType: 'text',
				name: 'menu_name',
				fieldLabel: __('Menu Name', 'native-custom-fields'),
				placeholder: 'Book Categories'
			},
			{
				fieldType: 'text',
				name: 'name_admin_bar',
				fieldLabel: __('Admin Bar Name', 'native-custom-fields'),
				placeholder: 'Book Categories'
			},
			{
				fieldType: 'text',
				name: 'add_new_item',
				fieldLabel: __('Add New Item', 'native-custom-fields'),
				placeholder: 'Add New Book Category'
			},
			{
				fieldType: 'text',
				name: 'new_item_name',
				fieldLabel: __('Add New Item Name', 'native-custom-fields'),
				placeholder: 'Add New Book Category Name'
			},
			{
				fieldType: 'text',
				name: 'template_name',
				fieldLabel: __('Archive Name', 'native-custom-fields'),
				placeholder: 'Book Category Archive'
			},
			{
				fieldType: 'text',
				name: 'separate_items_with_commas',
				fieldLabel: __('Separate Items with Commas', 'native-custom-fields'),
				fieldHelpText: __('This label is only used for non-hierarchical taxonomies. Default "Separate tags with commas", used in the meta box.', 'native-custom-fields'),
			},
			{
				fieldType: 'text',
				name: 'add_or_remove_items',
				fieldLabel: __('Edit or Remove Items', 'native-custom-fields'),
				fieldHelpText: __('This label is only used for non-hierarchical taxonomies. Default "Add or remove tags", used in the meta box when JavaScript is disabled.', 'native-custom-fields'),
			},
			{
				fieldType: 'text',
				name: 'most_used',
				fieldLabel: __('Most Used', 'native-custom-fields'),
				placeholder: 'Most Used',
			},
			{
				fieldType: 'text',
				name: 'choose_from_most_used',
				fieldLabel: __('Choose from Most Used', 'native-custom-fields'),
				placeholder: 'Choose from the most used Book Categories',
			},
			{
				fieldType: 'text',
				name: 'back_to_items',
				fieldLabel: __('Back to Items', 'native-custom-fields'),
				placeholder: 'Back to Book Categories'
			},
			{
				fieldType: 'text',
				name: 'item_link',
				fieldLabel: __('Item Link', 'native-custom-fields'),
				placeholder: 'Book Category Link'
			},
			{
				fieldType: 'text',
				name: 'item_link_description',
				fieldLabel: __('Item Link', 'native-custom-fields'),
				placeholder: 'A link to a Book Category'
			},
			{
				fieldType: 'text',
				name: 'all_items',
				fieldLabel: __('All Items', 'native-custom-fields'),
				placeholder: 'All Book Categories'
			},
			{
				fieldType: 'text',
				name: 'view_item',
				fieldLabel: __('View Item', 'native-custom-fields'),
				placeholder: 'View Book Category'
			},
			{
				fieldType: 'text',
				name: 'update_item',
				fieldLabel: __('Update Item', 'native-custom-fields'),
				placeholder: 'Update Book Category'
			},
			{
				fieldType: 'text',
				name: 'search_items',
				fieldLabel: __('Search Items', 'native-custom-fields'),
				placeholder: 'Search Books'
			},
			{
				fieldType: 'text',
				name: 'popular_items',
				fieldLabel: __('Popular Items', 'native-custom-fields'),
				placeholder: 'Popular Book Categories'
			},
			{
				fieldType: 'text',
				name: 'parent_item',
				fieldLabel: __('Parent Item Colon', 'native-custom-fields'),
				placeholder: 'Parent Book Category'
			},
			{
				fieldType: 'text',
				name: 'parent_item_colon',
				fieldLabel: __('Parent Item Colon', 'native-custom-fields'),
				placeholder: 'Parent Book Category:'
			},
			{
				fieldType: 'text',
				name: 'name_field_description',
				fieldLabel: __('Name Field Description', 'native-custom-fields'),
				fieldHelpText: __('Description for the Name field on Edit Tags screen. Default "The name is how it appears on your site."', 'native-custom-fields'),
			},
			{
				fieldType: 'text',
				name: 'slug_field_description',
				fieldLabel: __('Slug Field Description', 'native-custom-fields'),
				fieldHelpText: 'Description for the Slug field on Edit Tags screen. Default "The taxonomy_slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."'
			},
			{
				fieldType: 'text',
				name: 'parent_field_description',
				fieldLabel: __('Parent Field Description', 'native-custom-fields'),
				fieldHelpText: __('Description for the Parent field on Edit Tags screen. Default "Assign a parent term to create a hierarchy.The term Jazz, for example, would be the parent of Bebop and Big Band."', 'native-custom-fields'),
			},
			{
				fieldType: 'text',
				name: 'desc_field_description',
				fieldLabel: __('Description Field Description', 'native-custom-fields'),
				fieldHelpText: __('Description for the Description field on Edit Tags screen. Default "The description is not prominent by default; however, some themes may show it."', 'native-custom-fields'),
			},
			{
				fieldType: 'text',
				name: 'not_found',
				fieldLabel: __('Not Found', 'native-custom-fields'),
				placeholder: 'No book categories found'
			},
			{
				fieldType: 'text',
				name: 'no_terms',
				fieldLabel: __('Not Terms', 'native-custom-fields'),
				placeholder: 'No book categories'
			},
			{
				fieldType: 'text',
				name: 'filter_by_item',
				fieldLabel: __('Filter by Item', 'native-custom-fields'),
				placeholder: 'Filter by book category'
			},
			{
				fieldType: 'text',
				name: 'items_list_navigation',
				fieldLabel: __('Items List Navigation', 'native-custom-fields'),
				placeholder: 'Book Category list navigation'
			},
			{
				fieldType: 'text',
				name: 'items_list',
				fieldLabel: __('Items List', 'native-custom-fields'),
				placeholder: 'Book Category list'
			}
		]
	},
	{
		section_name: 'native_custom_fields_create_taxonomy_visibility',
		section_icon: 'visibility',
		section_title: __('Visibility', 'native-custom-fields'),
		fields: [
			{
				fieldType: 'toggle',
				name: 'public',
				fieldLabel: __('Public', 'native-custom-fields'),
				fieldHelpText: __('Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users. ', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'hierarchical',
				fieldLabel: __('Hierarchical', 'native-custom-fields'),
				fieldHelpText: __('Whether the taxonomy is hierarchical.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'publicly_queryable',
				fieldLabel: __('Publicly Queryable', 'native-custom-fields'),
				fieldHelpText: __('Whether the taxonomy is publicly queryable.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'show_ui',
				fieldLabel: __('Show UI', 'native-custom-fields'),
				fieldHelpText: __('Whether to generate and allow a UI for managing terms in this taxonomy in the admin.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'show_in_menu',
				fieldLabel: __('Show in Menu', 'native-custom-fields'),
				fieldHelpText: __('Whether to show the taxonomy in the admin menu.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'show_in_nav_menus',
				fieldLabel: __('Show in Navigation Menus', 'native-custom-fields'),
				fieldHelpText: __('Makes this taxonomy available for selection in navigation menus.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'show_tagcloud',
				fieldLabel: __('Show in Tag Cloud', 'native-custom-fields'),
				fieldHelpText: __('Whether to list the taxonomy in the Tag Cloud Widget controls.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'show_in_quick_edit',
				fieldLabel: __('Show in Quick Edit', 'native-custom-fields'),
				fieldHelpText: __('Whether to show the taxonomy in the quick/bulk edit panel.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'toggle',
				name: 'show_admin_column',
				fieldLabel: __('Show in Admin Column', 'native-custom-fields'),
				fieldHelpText: __('Whether to display a column for the taxonomy on its post type listing screens. Default false.', 'native-custom-fields'),
				default: false
			},
		]
	},
	{
		section_name: 'native_custom_fields_create_taxonomy_capabilities',
		section_icon: 'superhero-alt',
		section_title: __('Capabilities', 'native-custom-fields'),
		fields: [
			{
				fieldType: 'token_field',
				name: 'capabilities',
				fieldLabel: __('Capabilities', 'native-custom-fields'),
				fieldHelpText: __('Capabilities for this taxonomy.', 'native-custom-fields'),
				maxLength: 4,
				suggestions: ['manage_terms', 'edit_terms', 'delete_terms', 'assign_terms'],
				__experimentalExpandOnFocus: true,
				__experimentalAutoSelectFirstMatch: true,
				__experimentalValidateInput: (input) => {
					input = input.trim();
					if (input !== 'manage_terms' && input !== 'edit_terms' && input !== 'delete_terms' && input !== 'assign_terms') {
						return null;
					}

					return input;
				}
			},
			{
				fieldType: 'toggle',
				name: 'sort',
				fieldLabel: __('Sort', 'native-custom-fields'),
				fieldHelpText: __('Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms().', 'native-custom-fields'),
				default: false
			}
		]
	},
	{
		section_name: 'native_custom_fields_create_taxonomy_rest_api',
		section_icon: 'rest-api',
		section_title: __('Rest API', 'native-custom-fields'),
		fields: [
			{
				fieldType: 'toggle',
				name: 'show_in_rest',
				fieldLabel: __('Show in REST API', 'native-custom-fields'),
				fieldHelpText: __('Whether to include the taxonomy in the REST API.', 'native-custom-fields'),
				default: true
			},
			{
				fieldType: 'text',
				name: 'rest_base',
				fieldLabel: __('REST API Base', 'native-custom-fields'),
				fieldHelpText: __('To change the base url of REST API route. Default is taxonomy slug.', 'native-custom-fields'),
				placeholder: 'book-categories'
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
				default: 'WP_REST_Terms_Controller'
			}
		]
	},
	{
		section_name: 'native_custom_fields_create_taxonomy_permalinks',
		section_icon: 'admin-links',
		section_title: __('Permalinks', 'native-custom-fields'),
		fields: [
			{
				fieldType: 'toggle',
				name: 'rewrite',
				fieldLabel: __('Rewrite Permalinks', 'native-custom-fields'),
				fieldHelpText: __('Triggers the handling of rewrites for this taxonomy. To prevent rewrites, set to false. Default: true and use taxonomy slug.', 'native-custom-fields'),
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
						fieldHelpText: __('Customize the permalink structure slug. Defaults to the taxonomy slug.', 'native-custom-fields'),
						placeholder: 'my-slug'
					},
					{
						fieldType: 'toggle',
						name: 'with_front',
						fieldLabel: __('With Front', 'native-custom-fields'),
						fieldHelpText: __('Should the permastruct be prepended with WP_Rewrite::$front. Default true.', 'native-custom-fields'),
						default: true
					},
					{
						fieldType: 'toggle',
						name: 'hierarchical',
						fieldLabel: __('Hierarchical', 'native-custom-fields'),
						fieldHelpText: __('Either hierarchical rewrite tag or not. Default false.', 'native-custom-fields'),
						default: false,
					},
					{
						fieldType: 'text',
						name: 'ep_mask',
						fieldLabel: __('EP Mask', 'native-custom-fields'),
						fieldHelpText: __('Assign an endpoint mask. Default EP_NONE.', 'native-custom-fields'),
						default: 'EP_NONE'
					}
				]
			},
		]
	}
];
