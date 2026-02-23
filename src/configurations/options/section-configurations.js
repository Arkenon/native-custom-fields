import {__} from "@wordpress/i18n";
import {fieldConfigurations} from "@nativecustomfields/configurations/field-configurations";

const urlParams = new URLSearchParams(window.location.search);
const menuSlug = urlParams.get('menu_slug');

export const sectionConfigurations = [
	{
		section_name: 'native_custom_fields_create_options_page_fields',
		section_title: __('Options Page Fields', 'native-custom-fields'),
		section_icon: null,
		fields: [
			{
				fieldType: 'text',
				name: 'menu_slug',
				fieldLabel: __('Menu Slug', 'native-custom-fields'),
				default: menuSlug,
				disabled: true,
			},
			{
				fieldType: 'repeater',
				min: 1,
				name: 'options_page_sections',
				fieldLabel: __('Menu Sections', 'native-custom-fields'),
				addButtonText: __('Add New Section', 'native-custom-fields'),
				initialOpen: false,
				fields: [
					{
						fieldType: 'group',
						name: 'section_info',
						fieldLabel: __('Section Info', 'native-custom-fields'),
						fields: [
							{
								fieldType: 'text',
								name: 'section_name',
								fieldLabel: __('Section Name', 'native-custom-fields'),
								fieldHelpText: __('The ID of the section. It should be unique. e.g. "my_theme_details"', 'native-custom-fields'),
								required: true
							},
							{
								fieldType: 'text',
								name: 'section_title',
								fieldLabel: __('Section Title', 'native-custom-fields'),
								required: true,
								setAsRepeaterItemTag: true
							},
							{
								fieldType: 'text',
								name: 'section_icon',
								fieldLabel: __('Section Icon', 'native-custom-fields'),
								fieldHelpText: __('Type a dashicon name without "dashicon" prefix. See icons: https://developer.wordpress.org/resource/dashicons/', 'native-custom-fields'),
								default: 'admin-generic'
							},
						]
					},
					{
						fieldType: 'repeater',
						min: 1,
						name: 'options_page_section_fields',
						fieldLabel: __('Fields', 'native-custom-fields'),
						addButtonText: __('Add New Field', 'native-custom-fields'),
						required: true,
						initialOpen: false,
						fields: fieldConfigurations
					}
				]
			}
		]
	}
]
