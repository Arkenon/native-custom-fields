import {__} from '@wordpress/i18n';

const fieldCustomInfoSection = {
	fieldType: 'group',
	name: 'field_custom_info_section',
	fieldLabel: __('Section Info', 'native-custom-fields'),
	direction: 'column',
	fields: [
		{
			fieldType: 'text',
			name: 'section_icon',
			fieldLabel: __('Section Icon', 'native-custom-fields'),
			fieldHelpText: __('Type a dashicon name without "dashicon" prefix. See icons: https://developer.wordpress.org/resource/dashicons/', 'native-custom-fields'),
			default: 'admin-generic'
		},
	],
	dependencies: {
		relation: 'and',
		conditions: [
			{
				field: 'fieldType',
				operator: '===',
				value: 'section'
			}
		]
	}
};

export default fieldCustomInfoSection;
