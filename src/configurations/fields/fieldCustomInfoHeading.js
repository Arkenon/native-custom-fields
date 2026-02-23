import {__} from '@wordpress/i18n';

const fieldCustomInfoHeading = {
    fieldType: 'group',
    name: 'field_custom_info_heading',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'text',
            fieldLabel: __('Text', 'native-custom-fields'),
            fieldHelpText: __('Heading content.', 'native-custom-fields'),
        },
        {
            fieldType: 'number',
            name: 'level',
            fieldLabel: __('Heading Level', 'native-custom-fields'),
            fieldHelpText: __('The heading level: 1 | 2 | 3 | 4 | 5 | 6', 'native-custom-fields'),
            default: 2,
            min: 1,
            max: 6
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'heading'
            }
        ]
    }
}
export default fieldCustomInfoHeading;
