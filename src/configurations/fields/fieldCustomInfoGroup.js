import {__} from '@wordpress/i18n';

const fieldCustomInfoGroup =  {
	fieldType: 'group',
	name: 'field_custom_info_group',
	fieldLabel: __('Field Custom Options', 'native-custom-fields'),
	direction: 'column',
	layout: 'flex',
	justify: 'flex-start',
	fields: [
		{
			fieldType: 'toggle_group',
			name: 'layout',
			options: [
				{label: __('Flex', 'native-custom-fields'), value: 'flex'},
				{label: __('Grid', 'native-custom-fields'), value: 'grid'}
			],
			fieldLabel: __('Layout', 'native-custom-fields'),
			fieldHelpText: __('Select layout of Group field. Default is flex.', 'native-custom-fields'),
			default: 'flex'
		},
		{
			fieldType: 'number',
			name: 'columns',
			fieldLabel: __('Columns', 'native-custom-fields'),
			fieldHelpText: __('Column size for grid layout', 'native-custom-fields'),
			default: 3,
			dependencies: {
				relation: 'and',
				conditions: [
					{
						field: 'layout',
						operator: '===',
						value: 'grid'
					}
				]
			}
		},
		{
			fieldType: 'select',
			name: 'direction',
			fieldLabel: __('Direction', 'native-custom-fields'),
			fieldHelpText: __('Flex direction. Column or row.', 'native-custom-fields'),
			default: 'columnRow',
			options: [
				{label: __('Row', 'native-custom-fields'), value: 'row'},
				{label: __('Row (Responsive)', 'native-custom-fields'), value: 'columnRow'},
				{label: __('Column', 'native-custom-fields'), value: 'column'}
			]
		},
		{
			fieldType: 'select',
			name: 'justify',
			fieldLabel: __('Justify', 'native-custom-fields'),
			fieldHelpText: __('Justify the fields when grid layout is active.', 'native-custom-fields'),
			default: 'space-between',
			options: [
				{label: __('Flex Start', 'native-custom-fields'), value: 'flex-start'},
				{label: __('Center', 'native-custom-fields'), value: 'center'},
				{label: __('Flex End', 'native-custom-fields'), value: 'flex-end'},
				{label: __('Space Between', 'native-custom-fields'), value: 'space-between'},
				{label: __('Space Around', 'native-custom-fields'), value: 'space-around'},
				{label: __('Space Evenly', 'native-custom-fields'), value: 'space-evenly'}
			],
			dependencies: {
				relation: 'and',
				conditions: [
					{
						field: 'direction',
						operator: '!=',
						value: 'column'
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
				value: 'group'
			}
		]
	}
};

export default fieldCustomInfoGroup;
