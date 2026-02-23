import {__} from '@wordpress/i18n';

const fieldCustomInfoMediaLibrary = {
    fieldType: 'group',
    name: 'field_custom_info_media_library',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'select',
            multiple: true,
            name: 'allowedTypes',
            fieldLabel: __('Allowed Media Types', 'native-custom-fields'),
            fieldHelpText: __('Choose which media types can be chosen from the library. Leave empty to allow all types.', 'native-custom-fields'),
            options: [
                {label: __('Image', 'native-custom-fields'), value: 'image'},
                {label: __('Video', 'native-custom-fields'), value: 'video'},
                {label: __('Audio', 'native-custom-fields'), value: 'audio'},
                {label: __('Document (PDF, DOC…)', 'native-custom-fields'), value: 'application'},
            ],
        },
        {
            fieldType: 'toggle',
            name: 'multiple',
            fieldLabel: __('Multiple', 'native-custom-fields'),
            fieldHelpText: __('Allow selecting multiple files from the media library.', 'native-custom-fields'),
            default: false,
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'media_library',
            },
        ],
    },
};

export default fieldCustomInfoMediaLibrary;

