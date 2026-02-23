import {__} from "@wordpress/i18n";
import {helpTextForSelectRadioOptions} from "@nativecustomfields/configurations/fields/helpTextForSelectRadioOptions.js";

const fieldCustomInfoRadio = {
    fieldType: 'group',
    name: 'field_custom_info_radio',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'textarea',
            name: 'options',
            fieldLabel: __('Options', 'native-custom-fields'),
            fieldHelpText: helpTextForSelectRadioOptions,
            placeholder: 'Option 1 : option_1, Option 2 : option_2',
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'radio'
            }
        ]
    }
}

export default fieldCustomInfoRadio;
