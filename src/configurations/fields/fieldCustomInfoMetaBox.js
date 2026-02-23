import {__} from '@wordpress/i18n';

const fieldCustomInfoMetaBox = {
	fieldType: 'group',
	name: 'field_custom_info_meta_box',
	fieldLabel: __('Meta Box Settings', 'native-custom-fields'),
	direction: 'column',
	fields: [
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
	],
	dependencies: {
		relation: 'and',
		conditions: [
			{
				field: 'fieldType',
				operator: '===',
				value: 'meta_box'
			}
		]
	}
};

export default fieldCustomInfoMetaBox;
