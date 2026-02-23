import {__} from "@wordpress/i18n";

const fieldCustomInfoColorPicker =  {
    fieldType: 'group',
    name: 'field_custom_info_color_picker',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'color',
            fieldLabel: __('Color', 'native-custom-fields'),
            fieldHelpText: __('The current color value to display in the picker. Must be a hex or hex8 string.', 'native-custom-fields')
        },
        {
            fieldType: 'toggle',
            name: 'enableAlpha',
            fieldLabel: __('Enable Alpha', 'native-custom-fields'),
            fieldHelpText: __('When true the color picker will display the alpha channel both in the bottom inputs as well as in the color picker itself.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'select',
            name: 'copyFormat',
            fieldLabel: __('Copy Format', 'native-custom-fields'),
            fieldHelpText: __('The format to copy when clicking the displayed color format.', 'native-custom-fields'),
            default: 'hex',
            options: [
                {label: __('Hex', 'native-custom-fields'), value: 'hex'},
                {label: __('Hsl', 'native-custom-fields'), value: 'hsl'},
                {label: __('Rgb', 'native-custom-fields'), value: 'rgb'}
            ]
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'color_picker'
            }
        ]
    }
}

export default fieldCustomInfoColorPicker;
