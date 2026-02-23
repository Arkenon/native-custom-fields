import {__} from "@wordpress/i18n";
import {helpTextForSelectRadioOptions} from "@nativecustomfields/configurations/fields/helpTextForSelectRadioOptions.js";

const fieldCustomInfoSelect = {
    fieldType: 'group',
    name: 'field_custom_info_select',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'textarea',
            name: 'options',
            fieldLabel: __('Options', 'native-custom-fields'),
            fieldHelpText: helpTextForSelectRadioOptions,
            placeholder: 'Option 1 : option_1, Option 2 : option_2'
        },
        {
            fieldType: 'radio',
            name: 'variant',
            fieldLabel: __('Variant', 'native-custom-fields'),
            fieldHelpText: __('The style variant of the control.', 'native-custom-fields'),
            default: 'default',
            options: [
                {label: __('Default', 'native-custom-fields'), value: 'default'},
                {label: __('Minimal', 'native-custom-fields'), value: 'minimal'}
            ]
        },
        {
            fieldType: 'toggle',
            name: 'multiple',
            fieldLabel: __('Multiple', 'native-custom-fields'),
            fieldHelpText: __('If this property is added, multiple values can be selected. The value passed should be an array.', 'native-custom-fields'),
            default: false
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
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'select'
            }
        ]
    }
}

export default fieldCustomInfoSelect;
