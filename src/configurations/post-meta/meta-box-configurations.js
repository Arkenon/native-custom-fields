/**
 * @deprecated This file is deprecated and will be removed in future versions.
 * TreeViewForm now uses field-configurations.js directly.
 * This was used by the old EditOrSavePostMetaFields.js component.
 */

import {__} from "@wordpress/i18n";
import {fieldConfigurations} from "@nativecustomfields/configurations/field-configurations";

const urlParams = new URLSearchParams(window.location.search);
const post_type_slug = urlParams.get('post_type_slug');

export const metaBoxConfigurations = [
	{
		section_name: 'native_custom_fields_create_post_meta_fields',
		section_title: __('Create Post Meta Fields', 'native-custom-fields'),
		fields: [
			{
				fieldType: 'text',
				name: 'post_type',
				fieldLabel: __('Post Type Slug', 'native-custom-fields'),
				default: post_type_slug,
				disabled: true,
			},
			{
				fieldType: 'repeater',
				name: 'meta_boxes',
                initialOpen: false,
				addButtonText: __('Add New Meta Box', 'native-custom-fields'),
				fields: [
					{
						fieldType: 'group',
						name: 'meta_box_info',
						fieldLabel: __('Meta Box Info', 'native-custom-fields'),
						fields: [
							{
								fieldType: 'text',
								name: 'meta_box_id',
								fieldLabel: __('Meta Box ID', 'native-custom-fields'),
								fieldHelpText: __('The ID of the meta box. It should be unique. e.g. "my_post_details"', 'native-custom-fields'),
								required: true
							},
							{
								fieldType: 'text',
								name: 'meta_box_title',
								fieldLabel: __('Meta Box Title', 'native-custom-fields'),
								required: true,
								setAsRepeaterItemTag: true,
							},
							{
								fieldType: 'select',
								name: 'meta_box_context',
								fieldHelpText: __('The part of the edit screen where the meta box should be shown. e.g. "normal", "side", "advanced"', 'native-custom-fields'),
								fieldLabel: __('Meta Box Context', 'native-custom-fields'),
								options: [
									{label: __('Normal', 'native-custom-fields'), value: 'normal'},
									{label: __('Side', 'native-custom-fields'), value: 'side'},
									{label: __('Advanced', 'native-custom-fields'), value: 'advanced'},
								],
								default: 'advanced',
							},
							{
								fieldType: 'select',
								name: 'meta_box_priority',
								fieldHelpText: __('The priority within the context where the meta box should show. e.g. "high", "low"', 'native-custom-fields'),
								fieldLabel: __('Meta Box Priority', 'native-custom-fields'),
								options: [
									{label: __('Default', 'native-custom-fields'), value: 'default'},
									{label: __('High', 'native-custom-fields'), value: 'high'},
									{label: __('Core', 'native-custom-fields'), value: 'core'},
									{label: __('Low', 'native-custom-fields'), value: 'low'},
								],
								default: 'default'
							},
						]
					},
					{
						fieldType: 'repeater',
						name: 'meta_box_fields',
						fieldLabel: __('Fields', 'native-custom-fields'),
						addButtonText: __('Add New Field', 'native-custom-fields'),
                        initialOpen: false,
						required: true,
						fields: fieldConfigurations
					}
				]
			}
		]
	}
]
