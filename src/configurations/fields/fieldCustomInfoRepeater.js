import {__} from '@wordpress/i18n';

const fieldCustomInfoRepeater =  {
		fieldType: 'group',
		name: 'field_custom_info_repeater',
		fieldLabel: __('Field Custom Options', 'native-custom-fields'),
		direction: 'column',
		fields: [
		{
			fieldType: 'toggle_group',
			name: 'layout',
			fieldLabel: __('Layout', 'native-custom-fields'),
			fieldHelpText: __('Set repeater layout. Default is panel.', 'native-custom-fields'),
			default: 'table',
			options: [
				{label: __('Table', 'native-custom-fields'), value: 'table'},
				{label: __('Panel', 'native-custom-fields'), value: 'panel'},
			],
		},
		{
			fieldType: 'text',
			name: 'addButtonText',
			fieldLabel: __('Add Button Text', 'native-custom-fields'),
			fieldHelpText: __('Text for the add new item button.', 'native-custom-fields'),
			default: __('Add Item', 'native-custom-fields')
		},
		{
			fieldType: 'number',
			name: 'min',
			fieldLabel: __('Minimum Items', 'native-custom-fields'),
			fieldHelpText: __('Minimum number of items allowed.', 'native-custom-fields'),
			default: 0
		},
		{
			fieldType: 'number',
			name: 'max',
			fieldLabel: __('Maximum Items', 'native-custom-fields'),
			fieldHelpText: __('Maximum number of items allowed.', 'native-custom-fields'),
			default: 50
		},
		{
			fieldType: 'toggle',
			name: 'initialOpen',
			fieldLabel: __('Open Panels By Default', 'native-custom-fields'),
			fieldHelpText: __('Whether repeater item panels are open initially.', 'native-custom-fields'),
			default: false,
			dependencies: {
				relation: 'and',
				conditions: [
					{
						field: 'layout',
						operator: '===',
						value: 'panel'
					}
				]
			}
		}
	],
	dependencies: {
		relation: 'and',
		conditions: [
			{
				field: 'fieldType',
				operator: '===',
				value: 'repeater'
			}
		]
	}
};

export default fieldCustomInfoRepeater;
