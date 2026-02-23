import {__} from "@wordpress/i18n";
import {helpTextForSelectRadioOptions} from "@nativecustomfields/configurations/fields/helpTextForSelectRadioOptions.js";

const fieldCustomInfoToggleGroup =  {
    fieldType: 'group',
    name: 'field_custom_info_toggle_group',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'textarea',
            name: 'options',
            fieldLabel: __('Options', 'native-custom-fields'),
            fieldHelpText: helpTextForSelectRadioOptions,
            placeholder: 'Option 1 : option_1, Option 2 : option_2',
        },
        {
            fieldType: 'toggle',
            name: 'isAdaptiveWidth',
            fieldLabel: __('Adaptive Width', 'native-custom-fields'),
            fieldHelpText: __('Determines if segments should be rendered with equal widths.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'isDeselectable',
            fieldLabel: __('Deselectable', 'native-custom-fields'),
            fieldHelpText: __('Whether an option can be deselected by clicking it again.', 'native-custom-fields'),
            default: false
        },
        {
            fieldType: 'toggle',
            name: 'isBlock',
            fieldLabel: __('Is Block', 'native-custom-fields'),
            fieldHelpText: __('Renders ToggleGroupControl as a (CSS) block element, spanning the entire width of the available space. This is the recommended style when the options are text-based and not icons.', 'native-custom-fields'),
            default: false
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'toggle_group'
            }
        ]
    }
}

export default fieldCustomInfoToggleGroup;
