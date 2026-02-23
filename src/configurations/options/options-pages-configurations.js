import {__} from "@wordpress/i18n";

export const optionsPagesConfigurations = [
	{
		section_name: 'native_custom_fields_create_options_page',
		section_title: __('Options Page Details', 'native-custom-fields'),
		section_icon: null,
		fields: [
			{
				fieldType: 'text',
				name: 'menu_slug',
				fieldLabel: __('Menu Slug', 'native-custom-fields'),
				fieldHelpText: __('Type a slug for your menu. Use underscore between words.', 'native-custom-fields'),
				placeholder: 'my_menu_slug',
				required: true
			},
			{
				fieldType: 'text',
				name: 'page_title',
				fieldLabel: __('Page Title', 'native-custom-fields'),
				fieldHelpText: __('Type a title for your page to show in page.', 'native-custom-fields'),
				placeholder: __('My Options Page', 'native-custom-fields'),
				required: true
			},
			{
				fieldType: 'text',
				name: 'menu_title',
				fieldLabel: __('Menu Title', 'native-custom-fields'),
				fieldHelpText: __('Type a title for your page to show in admin menu. If not set Page Title used as Menu Title.', 'native-custom-fields'),
				placeholder: __('My Options Page', 'native-custom-fields'),
			},
			{
				fieldType: 'select',
				name: 'layout',
				fieldLabel: __('Select a Layout', 'native-custom-fields'),
				fieldHelpText: __('Choose a layout for your options page.', 'native-custom-fields'),
				default: 'stacked',
				options: [
					{label: __('Stacked', 'native-custom-fields'), value: 'stacked'},
					{label: __('Navigation', 'native-custom-fields'), value: 'navigation'},
					{label: __('Tab Panel', 'native-custom-fields'), value: 'tab_panel'},
				]
			},
			{
				fieldType: 'text',
				name: 'icon_url',
				fieldLabel: __('Icon', 'native-custom-fields'),
				fieldHelpText: __('Type a dashicon. See icons: https://developer.wordpress.org/resource/dashicons/', 'native-custom-fields'),
				default: 'dashicons-admin-generic'
			},
			{
				fieldType: 'number',
				name: 'position',
				default: 60,
				fieldLabel: __('Position', 'native-custom-fields'),
				fieldHelpText: __('Type a position for your menu. Use integer.', 'native-custom-fields'),
			},
		]
	}
];
