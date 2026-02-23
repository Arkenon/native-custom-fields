import {__} from "@wordpress/i18n";

const fieldCustomInfoRange =  {
    fieldType: 'group',
    name: 'field_custom_info_range',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'select',
            name: 'type',
            fieldLabel: __('Type', 'native-custom-fields'),
            fieldHelpText: __('Define if the value selection should present a stepper control or a slider control in the bottom sheet on mobile. To use the stepper set the type value as stepper. Defaults to slider if no option is provided.', 'native-custom-fields'),
            options: [
                {label: __('Slider', 'native-custom-fields'), value: 'slider'},
                {label: __('Stepper', 'native-custom-fields'), value: 'stepper'}
            ],
            default: 'slider'
        },
        {
            fieldType: 'textarea',
            name: 'marks',
            fieldLabel: __('Marks', 'native-custom-fields'),
            fieldHelpText: __('Renders a visual representation of step ticks. Label and value. Such as "10% : 10, 20% : 20"', 'native-custom-fields'),
            placeholder: '10% : 10, 20% : 20',
            dependencies: {
                relation: 'and',
                conditions: [
                    {
                        field: 'type',
                        operator: '===',
                        value: 'stepper'
                    }
                ]
            }
        },
        {
            fieldType: 'number',
            name: 'min',
            fieldLabel: __('Min', 'native-custom-fields'),
            fieldHelpText: __('The minimum value allowed. Default 0.', 'native-custom-fields'),
            default: 0
        },
        {
            fieldType: 'number',
            name: 'max',
            fieldLabel: __('Max', 'native-custom-fields'),
            fieldHelpText: __('The maximum value allowed. Default 100.', 'native-custom-fields'),
            default: 100
        },
        {
            fieldType: 'select',
            name: 'separatorType',
            fieldLabel: __('Separator Type', 'native-custom-fields'),
            fieldHelpText: __('Define if separator line under/above control row should be disabled or full width.', 'native-custom-fields'),
            options: [
                {label: __('None', 'native-custom-fields'), value: 'none'},
                {label: __('Full Width', 'native-custom-fields'), value: 'fullWidth'},
                {label: __('Top Full Width', 'native-custom-fields'), value: 'topFullWidth'}
            ]
        },
        {
            fieldType: 'number',
            name: 'resetFallbackValue',
            fieldLabel: __('Reset Value', 'native-custom-fields'),
            fieldHelpText: __('The value to revert to if the Reset button is clicked (enabled by allowReset)', 'native-custom-fields'),
            default: 100,
            dependencies: {
                relation: 'and',
                conditions: [
                    {
                        field: 'allowReset',
                        operator: '===',
                        value: 'true'
                    }
                ]
            }
        },
        {
            fieldType: 'color_palette',
            name: 'color',
            fieldLabel: __('Color', 'native-custom-fields'),
            fieldHelpText: __('CSS color string for the RangeControl wrapper.', 'native-custom-fields'),
        },
        {
            fieldType: 'toggle',
            name: 'allowReset',
            fieldLabel: __('Allow Reset', 'native-custom-fields'),
            fieldHelpText: __('If this property is true, a button to reset the slider is rendered.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'number',
            name: 'shiftStep',
            fieldLabel: __('Shift Step', 'native-custom-fields'),
            fieldHelpText: __(' if withInputField and isShiftStepEnabled are both true and while the number input has focus. Acts as a multiplier of step.', 'native-custom-fields'),
            dependencies: {
                relation: 'and',
                conditions: [
                    {
                        field: 'withInputField',
                        operator: '===',
                        value: 'true'
                    },
                    {
                        field: 'isShiftStepEnabled',
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
            fieldHelpText: __('If true, while the number input has focus, pressing UP or DOWN along with the SHIFT key will change the value by the shiftStep value.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'withInputField',
            fieldLabel: __('With Input Field', 'native-custom-fields'),
            fieldHelpText: __('Determines if the input number field will render next to the RangeControl. ', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'showTooltip',
            fieldLabel: __('Show Tooltip', 'native-custom-fields'),
            fieldHelpText: __('Forcing the Tooltip UI to show or hide. ', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'range'
            }
        ]
    }
}

export default fieldCustomInfoRange;
