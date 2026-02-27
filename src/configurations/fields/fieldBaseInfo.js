import {__} from "@wordpress/i18n";

const fieldBaseInfo = {
    fieldType: 'group',
    name: 'field_base_info',
    fieldLabel: __('Advanced Options', 'native-custom-fields'),
    layout: 'grid',
    columns: 2,
    fields: [

        {
            fieldType: 'text',
            name: 'fieldHelpText',
            fieldLabel: __('Help Text', 'native-custom-fields'),
            fieldHelpText: __('Short description for the field.', 'native-custom-fields'),
        },
        {
            fieldType: 'text',
            name: 'className',
            fieldLabel: __('Class Name', 'native-custom-fields'),
            fieldHelpText: __('The class that will be added with “components-base-control” to the classes of the wrapper div.', 'native-custom-fields'),
        },
        {
            fieldType: 'select',
            name: 'fieldLabelPosition',
            fieldLabel: __('Label Position', 'native-custom-fields'),
            options: [
                {label: __('Top', 'native-custom-fields'), value: 'top'},
                {label: __('Left', 'native-custom-fields'), value: 'left'},
            ],
            fieldHelpText: __('Default is Top.', 'native-custom-fields'),
            default: 'top'
        },
        {
            fieldType: 'select',
            name: 'fieldLabelTextTransform',
            fieldLabel: __('Label Text Transform', 'native-custom-fields'),
            fieldHelpText: __('Default is uppercase.', 'native-custom-fields'),
            options: [
                {label: __('Uppercase', 'native-custom-fields'), value: 'uppercase'},
                {label: __('Capitalize', 'native-custom-fields'), value: 'capitalize'},
                {label: __('Lowercase', 'native-custom-fields'), value: 'lowercase'},
            ],
            default: 'uppercase'
        },
        {
            fieldType: 'toggle',
            name: 'required',
            fieldLabel: __('Required', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'disabled',
            fieldLabel: __('Disabled', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'hideLabelFromVision',
            fieldLabel: __('Hide Label From Vision', 'native-custom-fields'),
            fieldHelpText: __('If true, the label will only be visible to screen readers.', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '!==',
                value: 'section'
            },
            {
                field: 'fieldType',
                operator: '!==',
                value: 'meta_box'
            },
            {
                field: 'fieldType',
                operator: '!==',
                value: 'heading'
            },
            {
                field: 'fieldType',
                operator: '!==',
                value: 'text_highlight'
            },
            {
                field: 'fieldType',
                operator: '!==',
                value: 'notice'
            }
        ]
    }
}

export default fieldBaseInfo;
