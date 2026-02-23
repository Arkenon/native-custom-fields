import {__} from '@wordpress/i18n';

const fieldCustomInfoNumber = {
    fieldType: 'group',
    name: 'field_custom_info_number',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'number',
            name: 'min',
            fieldHelpText: __('Minimum value for the field. Default is -infinity.', 'native-custom-fields'),
            fieldLabel: __('Min', 'native-custom-fields')
        },
        {
            fieldType: 'number',
            name: 'max',
            fieldHelpText: __('Maximum value for the field. Default is infinity.', 'native-custom-fields'),
            fieldLabel: __('Max', 'native-custom-fields')
        },
        {
            fieldType: 'number',
            name: 'step',
            fieldLabel: __('Step', 'native-custom-fields'),
            fieldHelpText: __('Amount by which the value is changed when incrementing/decrementing. Default is 1.', 'native-custom-fields'),
            default: 1
        },
        {
            fieldType: 'number',
            name: 'shiftStep',
            fieldLabel: __('Shift Step', 'native-custom-fields'),
            fieldHelpText: __('Amount to increment by when the SHIFT key is held down. Default is 10.', 'native-custom-fields')
        },
        {
            fieldType: 'select',
            name: 'dragDirection',
            fieldLabel: __('Drag Direction', 'native-custom-fields'),
            fieldHelpText: __('Determines the drag axis to increment/decrement the value. Directions: n | e | s | w', 'native-custom-fields'),
            default: 'n',
            options: [
                {label: __('North', 'native-custom-fields'), value: 'n'},
                {label: __('East', 'native-custom-fields'), value: 'e'},
                {label: __('South', 'native-custom-fields'), value: 's'},
                {label: __('West', 'native-custom-fields'), value: 'w'}
            ]
        },
        {
            fieldType: 'select',
            name: 'spinControls',
            fieldLabel: __('Spin Controls', 'native-custom-fields'),
            fieldHelpText: __('The type of spin controls to display. . "none", "native", "custom"', 'native-custom-fields'),
            default: 'native',
            options: [
                {label: __('Native', 'native-custom-fields'), value: 'native'},
                {label: __('Custom', 'native-custom-fields'), value: 'custom'},
                {label: __('None', 'native-custom-fields'), value: 'none'}
            ]
        },
        {
            fieldType: 'number',
            name: 'dragThreshold',
            fieldLabel: __('Drag Threshold', 'native-custom-fields'),
            fieldHelpText: __('If isDragEnabled is true, this controls the amount of px to have been dragged before the value changes.', 'native-custom-fields'),
            dependencies: {
                relation: 'and',
                conditions: [
                    {
                        field: 'isDragEnabled',
                        operator: '===',
                        value: 'true'
                    }
                ]
            }
        },
        {
            fieldType: 'toggle',
            name: 'isShiftStepEnabled',
            fieldLabel: __('Enable Shift Step', 'native-custom-fields'),
            fieldHelpText: __('If true, pressing UP or DOWN along with the SHIFT key will increment the value by the shiftStep value.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'isDragEnabled',
            fieldLabel: __('Enable Drag', 'native-custom-fields'),
            fieldHelpText: __('If true, enables mouse drag gesture to increment/decrement the number value.', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'number'
            }
        ]
    }
}

export default fieldCustomInfoNumber;
