import {__} from '@wordpress/i18n';

const fieldCustomInfoInput = {
    fieldType: 'group',
    name: 'field_custom_info_input',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'id',
            fieldLabel: __('ID', 'native-custom-fields'),
            fieldHelpText: __('The id of the input.', 'native-custom-fields')
        },
        {
            fieldType: 'select',
            name: 'size',
            fieldLabel: __('Size', 'native-custom-fields'),
            fieldHelpText: __('Adjusts the size of the input. Allowed values: default, small, __unstable-large, compact', 'native-custom-fields'),
            default: 'default',
            options: [
                {label: __('Default', 'native-custom-fields'), value: 'default'},
                {label: __('Small', 'native-custom-fields'), value: 'small'},
                {label: __('Large', 'native-custom-fields'), value: '__unstable-large'},
                {label: __('Compact', 'native-custom-fields'), value: 'compact'}
            ]
        },
        {
            fieldType: 'text',
            name: 'placeholder',
            fieldLabel: __('Placeholder', 'native-custom-fields')
        },
        {
            fieldType: 'text',
            name: 'prefix',
            fieldLabel: __('Prefix', 'native-custom-fields'),
            fieldHelpText: __('Renders an element before the input. You can use text (e.g., "$", "https://") or WordPress icon names (e.g., "search", "external", "lock"). For available icon names, see: https://wordpress.github.io/gutenberg/?path=/docs/icons-icon--docs', 'native-custom-fields')
        },
        {
            fieldType: 'text',
            name: 'suffix',
            fieldLabel: __('Suffix', 'native-custom-fields'),
            fieldHelpText: __('Renders an element after the input. You can use text (e.g., "USD", ".com") or WordPress icon names (e.g., "search", "external", "lock"). For available icon names, see: https://wordpress.github.io/gutenberg/?path=/docs/icons-icon--docs', 'native-custom-fields')
        },
        {
            fieldType: 'select',
            name: 'type',
            fieldLabel: __('Type', 'native-custom-fields'),
            fieldHelpText: __('Type of the input element. Allowed values: text, tel, time, url, week, month, email, date, datetime-local, number, color, password, file, hidden, search', 'native-custom-fields'),
            default: 'text',
            options: [
                {label: __('Text', 'native-custom-fields'), value: 'text'},
                {label: __('Tel', 'native-custom-fields'), value: 'tel'},
                {label: __('Time', 'native-custom-fields'), value: 'time'},
                {label: __('URL', 'native-custom-fields'), value: 'url'},
                {label: __('Week', 'native-custom-fields'), value: 'week'},
                {label: __('Month', 'native-custom-fields'), value: 'month'},
                {label: __('Email', 'native-custom-fields'), value: 'email'},
                {label: __('Date', 'native-custom-fields'), value: 'date'},
                {label: __('Datetime Local', 'native-custom-fields'), value: 'datetime-local'},
                {label: __('Number', 'native-custom-fields'), value: 'number'},
                {label: __('Color', 'native-custom-fields'), value: 'color'},
                {label: __('Password', 'native-custom-fields'), value: 'password'}
            ]
        },
        {
            fieldType: 'number',
            name: 'min',
            fieldLabel: __('Min', 'native-custom-fields'),
            fieldHelpText: __('Minimum value for the input. Only for number type.', 'native-custom-fields')
        },
        {
            fieldType: 'number',
            name: 'max',
            fieldLabel: __('Max', 'native-custom-fields'),
            fieldHelpText: __('Maximum value for the input. Only for number type.', 'native-custom-fields')
        },
        {
            fieldType: 'number',
            name: 'step',
            fieldLabel: __('Step', 'native-custom-fields'),
            fieldHelpText: __('Amount to increment/decrement. Only for number type. Default is 1.', 'native-custom-fields')
        },
        {
            fieldType: 'toggle',
            name: 'isPressEnterToChange',
            fieldLabel: __('Is Press Enter to Change', 'native-custom-fields'),
            fieldHelpText: __('If true, the ENTER key confirmation is required in order to trigger an onChange.', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'input'
            }
        ]
    }
}

export default fieldCustomInfoInput;

