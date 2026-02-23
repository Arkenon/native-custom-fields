import {__} from '@wordpress/i18n';

const fieldCustomInfoBorder = {
    fieldType: 'group',
    name: 'field_custom_info_border',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'select',
            name: 'size',
            fieldLabel: __('Size', 'native-custom-fields'),
            fieldHelpText: __('Size of the control. Allowed values: default, __unstable-large', 'native-custom-fields'),
            default: 'default',
            options: [
                {label: __('Default', 'native-custom-fields'), value: 'default'},
                {label: __('Large', 'native-custom-fields'), value: '__unstable-large'}
            ]
        },
        {
            fieldType: 'toggle',
            name: 'disableCustomColors',
            fieldLabel: __('Disable Custom Colors', 'native-custom-fields'),
            fieldHelpText: __('This toggles the ability to choose custom colors.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'disableUnits',
            fieldLabel: __('Disable Units', 'native-custom-fields'),
            fieldHelpText: __('This controls whether unit selection should be disabled.', 'native-custom-fields'),
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
            name: 'enableStyle',
            fieldLabel: __('Enable Style', 'native-custom-fields'),
            fieldHelpText: __('This controls whether to support border style selections.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'isCompact',
            fieldLabel: __('Is Compact', 'native-custom-fields'),
            fieldHelpText: __('This flags the BorderControl to render with a more compact appearance. It restricts the width of the control and prevents it from expanding to take up additional space.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'shouldSanitizeBorder',
            fieldLabel: __('Should Sanitize Border', 'native-custom-fields'),
            fieldHelpText: __('If opted into, sanitizing the border means that if no width or color have been selected, the border style is also cleared and undefined is returned as the new border value.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'withSlider',
            fieldLabel: __('With Slider', 'native-custom-fields'),
            fieldHelpText: __('Flags whether this BorderControl should also render a RangeControl for additional control over a border’s width.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'textarea',
            name: 'colors',
            fieldLabel: __('Colors', 'native-custom-fields'),
            fieldHelpText: __('An array of color objects for the color palette. Enter as JSON array. Example: [{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]', 'native-custom-fields'),
            placeholder: '[{"color": "#72aee6", "name": "Blue 20"}, {"color": "#3582c4", "name": "Blue 40"}]',
            rows: 6
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'border'
            }
        ]
    }
}

export default fieldCustomInfoBorder;
