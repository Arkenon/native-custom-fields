import { __ } from '@wordpress/i18n';

const fieldCustomInfoBorderBox = {
    fieldType: 'group',
    name: 'field_custom_info_border_box',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'select',
            name: 'popoverPlacement',
            fieldLabel: __('Popover Placement', 'native-custom-fields'),
            fieldHelpText: __('The position of the color popovers relative to the control wrapper.', 'native-custom-fields'),
            default: 'top',
            options: [
                {label: __('Top', 'native-custom-fields'), value: 'top'},
                {label: __('Left', 'native-custom-fields'), value: 'left'},
                {label: __('Right', 'native-custom-fields'), value: 'right'},
                {label: __('Bottom', 'native-custom-fields'), value: 'bottom'},
                {label: __('Top-end', 'native-custom-fields'), value: 'top-end'},
                {label: __('Top-start', 'native-custom-fields'), value: 'top-start'},
                {label: __('Left-end', 'native-custom-fields'), value: 'left-end'},
                {label: __('Left-start', 'native-custom-fields'), value: 'left-start'},
                {label: __('Right-end', 'native-custom-fields'), value: 'right-end'},
                {label: __('Right-start', 'native-custom-fields'), value: 'right-start'},
                {label: __('Bottom-end', 'native-custom-fields'), value: 'bottom-end'},
                {label: __('Bottom-start', 'native-custom-fields'), value: 'bottom-start'},
                {label: __('Overlay', 'native-custom-fields'), value: 'overlay'},
            ]
        },
        {
            fieldType: 'number',
            name: 'popoverOffset',
            fieldLabel: __('Popover Offset', 'native-custom-fields'),
            fieldHelpText: __('The space between the popover and the control wrapper.', 'native-custom-fields'),
        },
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
                value: 'border_box'
            }
        ]
    }
}
export default fieldCustomInfoBorderBox;
