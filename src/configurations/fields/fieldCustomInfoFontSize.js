import { __ } from '@wordpress/i18n';

const fieldCustomInfoFontSize = {
    fieldType: 'group',
    name: 'field_custom_info_font_size',
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
            fieldType: 'select',
            name: 'units',
            multiple: true,
            fieldLabel: __('Units', 'native-custom-fields'),
            fieldHelpText: __('Available units for custom font size selection.', 'native-custom-fields'),
            default: ['px', 'em', 'rem', 'vw', 'vh'],
            options: [
                {label: __('px', 'native-custom-fields'), value: 'px'},
                {label: __('em', 'native-custom-fields'), value: 'em'},
                {label: __('rem', 'native-custom-fields'), value: 'rem'},
                {label: __('vw', 'native-custom-fields'), value: 'vw'},
                {label: __('vh', 'native-custom-fields'), value: 'vh'},

            ]
        },
        {
            fieldType: 'toggle',
            name: 'disableCustomFontSizes',
            fieldLabel: __('Disable Custom Font Sizes', 'native-custom-fields'),
            fieldHelpText: __('If true, it will not be possible to choose a custom fontSize. The user will be forced to pick one of the pre-defined sizes passed in fontSizes.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'withReset',
            fieldLabel: __('With Reset', 'native-custom-fields'),
            fieldHelpText: __('If true, a reset button will be displayed alongside the input field when a custom font size is active. Has no effect when disableCustomFontSizes is true.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'withSlider',
            fieldLabel: __('With Slider', 'native-custom-fields'),
            fieldHelpText: __('If true, a slider will be displayed alongside the input field when a custom font size is active. Has no effect when disableCustomFontSizes is true.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'number',
            name: 'fallbackFontSize',
            fieldLabel: __('Fallback Font Size', 'native-custom-fields'),
            fieldHelpText: __('If no value exists, this prop defines the starting position for the font size picker slider. Only relevant if withSlider is true.', 'native-custom-fields'),
            conditions: [
                {
                    field: 'withSlider',
                    operator: '===',
                    value: true
                }
            ]
        },
        {
            fieldType: 'select',
            name: 'valueMode',
            fieldLabel: __('Value Mod', 'native-custom-fields'),
            fieldHelpText: __('Determines how the value prop should be interpreted. \'literal\': The value prop contains the actual font size value (number or string). \'slug\': The value prop contains the slug of the selected font size', 'native-custom-fields'),
            options: [
                {label: __('Literal', 'native-custom-fields'), value: 'literal'},
                {label: __('Slug', 'native-custom-fields'), value: 'slug'}
            ]
        },
        {
            fieldType: 'textarea',
            name: 'fontSizes',
            fieldLabel: __('Font Sizes', 'native-custom-fields'),
            fieldHelpText: __('An array of font size objects. Enter as JSON array. Example: [{"name": "Small", "size": 12, "slug": "small"}, {"name": "Normal", "size": 16, "slug": "normal"}]', 'native-custom-fields'),
            placeholder: '[{"name": "Small", "size": 12, "slug": "small"}, {"name": "Normal", "size": 16, "slug": "normal"}]',
            rows: 6
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'font_size'
            }
        ]
    }
}

export default fieldCustomInfoFontSize;
