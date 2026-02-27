import { __ } from '@wordpress/i18n';

const fieldCustomInfoNotice ={
    fieldType: 'group',
    name: 'field_custom_info_notice',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'flex',
    fields: [
        {
            fieldType: 'textarea',
            name: 'children',
            fieldLabel: __('Message', 'native-custom-fields'),
            fieldHelpText: __('The displayed message of a notice.', 'native-custom-fields'),
            required: true
        },
        {
            fieldType: 'select',
            name: 'status',
            fieldLabel: __('Status', 'native-custom-fields'),
            fieldHelpText: __('Determines the color of the notice: warning (yellow), success (green), error (red), or \'info\'. By default \'info\' will be blue, but if there is a parent Theme component with an accent color prop, the notice will take on that color instead.', 'native-custom-fields'),
            default: 'info',
            options: [
                {label: __('Warning', 'native-custom-fields'), value: 'warning'},
                {label: __('Success', 'native-custom-fields'), value: 'success'},
                {label: __('Error', 'native-custom-fields'), value: 'error'},
                {label: __('Info', 'native-custom-fields'), value: 'info'}
            ]
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'notice'
            }
        ]
    }
}

export default fieldCustomInfoNotice;
