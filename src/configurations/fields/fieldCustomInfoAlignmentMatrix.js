import { __ } from '@wordpress/i18n';

const fieldCustomInfoAlignmentMatrix = {
    fieldType: 'group',
    name: 'field_custom_info_alignment_matrix',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'number',
            name: 'width',
            fieldLabel: __('Width', 'native-custom-fields'),
            fieldHelpText: __('If provided, sets the width of the control.', 'native-custom-fields'),
            default: 92
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'alignment_matrix'
            }
        ]
    }
}
export default fieldCustomInfoAlignmentMatrix;
