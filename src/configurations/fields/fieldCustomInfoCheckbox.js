import {__} from "@wordpress/i18n";

const fieldCustomInfoCheckbox = {
    fieldType: 'group',
    name: 'field_custom_info_checkbox',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'toggle',
            name: 'indeterminate',
            fieldLabel: __('Indeterminate', 'native-custom-fields'),
            fieldHelpText: __('If indeterminate is true the state of the checkbox will be indeterminate.', 'native-custom-fields'),
            default: false
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'checkbox'
            }
        ]
    }
}

export default fieldCustomInfoCheckbox;
