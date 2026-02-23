import {__} from "@wordpress/i18n";

const fieldCustomInfoTextarea =  {
    fieldType: 'group',
    name: 'field_custom_info_textarea',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'number',
            name: 'rows',
            fieldLabel: __('Rows', 'native-custom-fields'),
            fieldHelpText: __('The number of rows the textarea should contain. Default: 4', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'text',
            name: 'placeholder',
            fieldLabel: __('Placeholder', 'native-custom-fields'),
            fieldHelpText: __('Add a placeholder text.', 'native-custom-fields'),
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'textarea'
            }
        ]
    }
}

export default fieldCustomInfoTextarea;
