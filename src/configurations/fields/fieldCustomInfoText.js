import {__} from "@wordpress/i18n";


const fieldCustomInfoText = {
    fieldType: 'group',
    name: 'field_custom_info_text',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'select',
            name: 'inputType',
            fieldLabel: __('Input Type', 'native-custom-fields'),
            fieldHelpText: __('Default is text.', 'native-custom-fields'),
            default: 'text',
            options: [
                {label: __('Text', 'native-custom-fields'), value: 'text'},
                {label: __('Number', 'native-custom-fields'), value: 'number'},
                {label: __('Search', 'native-custom-fields'), value: 'search'},
                {label: __('Time', 'native-custom-fields'), value: 'time'},
                {label: __('Date', 'native-custom-fields'), value: 'date'},
                {label: __('Datetime', 'native-custom-fields'), value: 'datetime-local'},
                {label: __('E-Mail', 'native-custom-fields'), value: 'email'},
                {label: __('Password', 'native-custom-fields'), value: 'password'},
                {label: __('Tel', 'native-custom-fields'), value: 'tel'},
                {label: __('Url', 'native-custom-fields'), value: 'url'}
            ]
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
                value: 'text'
            }
        ]
    }
}

export default fieldCustomInfoText;
