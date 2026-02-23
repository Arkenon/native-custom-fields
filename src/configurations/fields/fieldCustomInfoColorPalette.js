import { __ } from '@wordpress/i18n';

const fieldCustomInfoColorPalette = {
    fieldType: 'group',
    name: 'field_custom_info_color_palette',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'textarea',
            name: 'colors',
            fieldLabel: __('Colors', 'native-custom-fields'),
            fieldHelpText: __('An array of color objects for the color palette. Enter as JSON array. Example: [{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]', 'native-custom-fields'),
            placeholder: '[{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]',
            rows: 6
        },
        {
            fieldType: 'toggle',
            name: 'clearable',
            fieldLabel: __('Clearable', 'native-custom-fields'),
            fieldHelpText: __('Whether the palette should have a clearing button.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'disableCustomColors',
            fieldLabel: __('Disable Custom Colors', 'native-custom-fields'),
            fieldHelpText: __('Whether to allow the user to pick a custom color on top of the predefined choices (defined via the colors prop).', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'enableAlpha',
            fieldLabel: __('Enable Alpha', 'native-custom-fields'),
            fieldHelpText: __('This controls whether the alpha channel will be offered when selecting custom colors.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'asButtons',
            fieldLabel: __('As Buttons', 'native-custom-fields'),
            fieldHelpText: __('Whether the control should present as a set of buttons, each with its own tab stop.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'loop',
            fieldLabel: __('Loop', 'native-custom-fields'),
            fieldHelpText: __('Prevents keyboard interaction from wrapping around. Only used when asButtons is not true.', 'native-custom-fields'),
            default: true
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'color_palette'
            }
        ]
    }
}

export default fieldCustomInfoColorPalette;
