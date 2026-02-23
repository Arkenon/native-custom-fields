import { __ } from '@wordpress/i18n';

const fieldCustomInfoTokenField = {
    fieldType: 'group',
    name: 'field_custom_info_token_field',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'number',
            name: 'maxLength',
            fieldLabel: __('Max Length', 'native-custom-fields'),
            fieldHelpText: __('If passed, TokenField will disable ability to add new tokens once number of tokens is greater than or equal to maxLength.', 'native-custom-fields'),
        },
        {
            fieldType: 'number',
            name: 'maxSuggestions',
            fieldLabel: __('Max Suggestions', 'native-custom-fields'),
            fieldHelpText: __('The maximum number of suggestions to display at a time. Default 100.', 'native-custom-fields'),
            default: 100
        },
        {
            fieldType: 'textarea',
            name: 'suggestions',
            fieldLabel: __('Suggestions', 'native-custom-fields'),
            fieldHelpText: __('An array of strings to present to the user as suggested tokens. Separate values with comma. Such as "Africa, Europe, Asia"', 'native-custom-fields'),
            placeholder: 'Africa, Europe, Asia',
        },
        {
            fieldType: 'toggle',
            name: 'allowOnlySuggestions',
            fieldLabel: __('Allow Only Suggestions', 'native-custom-fields'),
            fieldHelpText: __('If true, only tokens that match one of the suggestions can be added. Free-form input will be rejected.', 'native-custom-fields'),
            default: false,
            dependencies: {
                relation: 'and',
                conditions: [
                    {
                        field: 'suggestions',
                        operator: '!=',
                        value: ''
                    }
                ]
            }
        },
        {
            fieldType: 'toggle',
            name: '__experimentalAutoSelectFirstMatch',
            fieldLabel: __('Auto Select First Match', 'native-custom-fields'),
            fieldHelpText: __('If true, the select the first matching suggestion when the user presses the Enter key (or space when tokenizeOnSpace is true).', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: '__experimentalExpandOnFocus',
            fieldLabel: __('Expand on Focus', 'native-custom-fields'),
            fieldHelpText: __('If true, the suggestions list will be always expanded when the input field has the focus.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'isBorderless',
            fieldLabel: __('Is Borderless', 'native-custom-fields'),
            fieldHelpText: __('When true, renders tokens as without a background.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'tokenizeOnBlur',
            fieldLabel: __('Tokenize on Blur', 'native-custom-fields'),
            fieldHelpText: __('If true, add any incompleteTokenValue as a new token when the field loses focus. ', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'tokenizeOnSpace',
            fieldLabel: __('Tokenize on Space', 'native-custom-fields'),
            fieldHelpText: __('If true, will add a token when TokenField is focused and space is pressed. ', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'token_field'
            }
        ]
    }
}

export default fieldCustomInfoTokenField;
