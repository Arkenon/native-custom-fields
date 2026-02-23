import {__} from "@wordpress/i18n";

const fieldCustomInfoBox = {
    fieldType: 'group',
    name: 'field_custom_info_box',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'toggle',
            name: 'allowReset',
            fieldLabel: __('Allow Reset', 'native-custom-fields'),
            fieldHelpText: __('If this property is true, a button to reset the box control is rendered.', 'native-custom-fields'),
            default: true
        },
        {
            fieldType: 'toggle',
            name: 'splitOnAxis',
            fieldLabel: __('Split on Axis', 'native-custom-fields'),
            fieldHelpText: __('If this property is true, when the box control is unlinked, vertical and horizontal controls can be used instead of updating individual sides.', 'native-custom-fields'),
            default: true
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'box'
            }
        ]
    }
}
export default fieldCustomInfoBox;
