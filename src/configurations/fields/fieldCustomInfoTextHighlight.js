import {__} from '@wordpress/i18n';

const fieldCustomInfoTextHighlight = {
    fieldType: 'group',
    name: 'field_custom_info_text_highlight',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'text',
            fieldLabel: __('Text', 'native-custom-fields'),
            fieldHelpText: __('The string of text to be tested for occurrences of then given highlight.', 'native-custom-fields'),
            default: ''
        },
        {
            fieldType: 'text',
            name: 'highlight',
            fieldLabel: __('Highlight', 'native-custom-fields'),
            fieldHelpText: __('The string to search for and highlight within the text. Case insensitive. Multiple matches.', 'native-custom-fields'),
            default: ''
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'text_highlight'
            }
        ]
    }
}

export default fieldCustomInfoTextHighlight;
