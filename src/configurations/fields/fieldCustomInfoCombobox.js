import { __ } from '@wordpress/i18n';
import {helpTextForSelectRadioOptions} from "@nativecustomfields/configurations/fields/helpTextForSelectRadioOptions.js";

const fieldCustomInfoCombobox = {
    fieldType: 'group',
    name: 'field_custom_info_combobox',
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
            fieldType: 'toggle',
            name: 'expandOnFocus',
            fieldLabel: __('Expand on Focus', 'native-custom-fields'),
            fieldHelpText: __('Automatically expand the dropdown when the control is focused. If the control is clicked, the dropdown will expand regardless of this prop.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'isLoading',
            fieldLabel: __('Is Loading', 'native-custom-fields'),
            fieldHelpText: __('Show a spinner (and hide the suggestions dropdown) while data about the matching suggestions (ie the options prop) is loading', 'native-custom-fields'),
            default: false
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'combobox'
            }
        ]
    }
}

export default fieldCustomInfoCombobox;
