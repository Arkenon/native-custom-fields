import {__} from "@wordpress/i18n";

const fieldDependencyInfo = {
    fieldType: 'group',
    name: 'field_dependency_info',
    fieldLabel: __('Dependency Options', 'native-custom-fields'),
    fields: [
        {
            fieldType: 'select',
            name: 'relation',
            fieldLabel: __('Relation', 'native-custom-fields'),
            default: 'and',
            options: [
                {label: __('And', 'native-custom-fields'), value: 'and'},
                {label: __('Or', 'native-custom-fields'), value: 'or'}
            ]
        },
        {
            fieldType: 'repeater',
            name: 'conditions',
            min: 0,
            addButtonText: __('Add Condition', 'native-custom-fields'),
            fieldLabel: __('Conditions', 'native-custom-fields'),
            fieldHelpText: __('Conditions to determine when this field should be visible. If no conditions are set, the field will always be visible.', 'native-custom-fields'),
            fields: [
                {
                    fieldType: 'text',
                    name: 'field',
                    fieldLabel: __('Field', 'native-custom-fields'),
                    fieldHelpText: __('The name of the field to check against.', 'native-custom-fields'),
                    required: true
                },
                {
                    fieldType: 'select',
                    name: 'operator',
                    fieldLabel: __('Operator', 'native-custom-fields'),
                    options: [
                        {label: __('Equal (==)', 'native-custom-fields'), value: '=='},
                        {label: __('Not Equal (!=)', 'native-custom-fields'), value: '!='},
                        {label: __('Matched (===)', 'native-custom-fields'), value: '==='},
                        {label: __('Not Matched (!==)', 'native-custom-fields'), value: '!=='},
                        {label: __('Greater Than (>)', 'native-custom-fields'), value: '>'},
                        {label: __('Less Than (<)', 'native-custom-fields'), value: '<'},
                        {label: __('Greater Than or Equal (>=)', 'native-custom-fields'), value: '>='},
                        {label: __('Less Than or Equal (<=)', 'native-custom-fields'), value: '<='}
                    ],
                    required: true
                },
                {
                    fieldType: 'text',
                    name: 'value',
                    fieldLabel: __('Value', 'native-custom-fields'),
                    fieldHelpText: __('The value to compare against. For boolean values type true or false as string.', 'native-custom-fields'),
                    required: true
                }
            ]
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
            }
        ]
    }
}

export default fieldDependencyInfo;
