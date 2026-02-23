import { __ } from '@wordpress/i18n';

const fieldCustomInfoFileUpload = {
    fieldType: 'group',
    name: 'field_custom_info_file_upload',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'accept',
            fieldLabel: __('Allowed File Types', 'native-custom-fields'),
            fieldHelpText: __('Specifies which file types can be uploaded. You can use:\n' +
                '• File extensions: .jpg, .png, .pdf\n' +
                '• MIME types: image/*, video/*, text/plain\n' +
                '• Mixed: image/*,.pdf,.doc\n' +
                'Separate multiple values with commas. Example: "image/*,video/*,.pdf"', 'native-custom-fields'),
        },
        {
            fieldType: 'number',
            name: 'maxFileSize',
            fieldLabel: __('Max File Size (As Kb)', 'native-custom-fields'),
            fieldHelpText: __('Set max file size as kb. Such as 2500 for 2500KB (2.5MB)', 'native-custom-fields'),
        },
        {
            fieldType: 'toggle',
            name: 'multiple',
            fieldLabel: __('Multiple', 'native-custom-fields'),
            fieldHelpText: __('Whether to allow multiple selection of files or not.', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'file_upload'
            }
        ]
    }
}

export default fieldCustomInfoFileUpload;
