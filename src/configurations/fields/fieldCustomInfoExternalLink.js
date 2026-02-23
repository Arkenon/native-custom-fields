import {__} from "@wordpress/i18n";

const fieldCustomInfoExternalLink = {
    fieldType: 'group',
    name: 'field_custom_info_external_link',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'children',
            fieldLabel: __('Content', 'native-custom-fields'),
            fieldHelpText: __('The content to be displayed within the link.', 'native-custom-fields'),
        },
        {
            fieldType: 'text',
            name: 'href',
            fieldLabel: __('URL', 'native-custom-fields'),
            fieldHelpText: __('The URL of the external resource.', 'native-custom-fields'),
        },
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'external_link'
            }
        ]
    }
}

export default fieldCustomInfoExternalLink;
