import {__} from "@wordpress/i18n";

const fieldCustomInfoUnit = {
    fieldType: 'group',
    name: 'field_custom_info_unit',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'toggle_group',
            name: 'size',
            fieldLabel: __('Size', 'native-custom-fields'),
            fieldHelpText: __('Adjusts the size of the input. Sizes include: default, small', 'native-custom-fields'),
            default: 'default',
            options: [
                {label: __('Default', 'native-custom-fields'), value: 'default'},
                {label: __('Small', 'native-custom-fields'), value: 'small'}
            ]
        },
        {
            fieldType: 'toggle',
            name: 'disableUnits',
            fieldLabel: __('Disable Units', 'native-custom-fields'),
            fieldHelpText: __('If true, the unit select is hidden.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'isPressEnterToChange',
            fieldLabel: __('Press Enter to Change', 'native-custom-fields'),
            fieldHelpText: __('If true, the ENTER key press is required in order to trigger an onChange. If enabled, a change is also triggered when tabbing away (onBlur).', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'isResetValueOnUnitChange',
            fieldLabel: __('Reset Value On Unit Change', 'native-custom-fields'),
            fieldHelpText: __('If true, and the selected unit provides a default value, this value is set when changing units.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'isUnitSelectTabbable',
            fieldLabel: __('Is Unit Select Tabbable', 'native-custom-fields'),
            fieldHelpText: __('Determines if the unit select is tabbable.', 'native-custom-fields'),
            default: true
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'unit'
            }
        ]
    }
}
export default fieldCustomInfoUnit;
