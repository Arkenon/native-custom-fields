import fieldBaseInfo from "@nativecustomfields/configurations/fields/fieldBaseInfo.js";
import fieldDependencyInfo from "@nativecustomfields/configurations/fields/fieldDependencyInfo.js";
import fieldCustomInfoList from "@nativecustomfields/configurations/fields/fieldCustomInfoList.js";
import {__} from "@wordpress/i18n";


export const fieldConfigurations = [
    {
        fieldType: 'notice',
        name: 'notice_for_datepickers',
        children: __('Consider using a TextControl with type="date" or type="datetime-local" instead.', 'native-custom-fields'),
        status: 'info',
        isDismissible: false,
        dependencies: {
            relation: 'or',
            conditions: [
                {
                    field: 'fieldType',
                    operator: '===',
                    value: 'date_picker'
                },
                {
                    field: 'fieldType',
                    operator: '===',
                    value: 'date_time_picker'
                },
                {
                    field: 'fieldType',
                    operator: '===',
                    value: 'time_picker'
                }
            ]
        }
    },
    {
        fieldType: 'text',
        name: 'name',
        fieldLabel: __('Field Name', 'native-custom-fields'),
        fieldHelpText: __('Type a unique slug for field. Such as post_title', 'native-custom-fields'),
        required: true
    },
    {
        fieldType: 'text',
        name: 'fieldLabel',
        fieldLabel: __('Label', 'native-custom-fields'),
        fieldHelpText: __('Label title for the field. It is required even if "Hide Label From Vision" is set to true.', 'native-custom-fields'),
        required: true,
        setAsRepeaterItemTag: true,
    },
	{
		fieldType: 'text',
		name: 'default',
		fieldLabel: __('Default Value', 'native-custom-fields'),
		fieldHelpText: __('Set a default value (optional)', 'native-custom-fields'),
        dependencies: {
            relation: 'and',
            conditions: [
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'section'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'meta_box'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'date_picker'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'date_time_picker'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'repeater'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'group'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'file_upload'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'media_library'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'heading'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'text_highlight'
                },
                {
                    field: 'fieldType',
                    operator: '!==',
                    value: 'notice'
                }
            ]
        }
	},
    ...fieldCustomInfoList,
    fieldBaseInfo,
    fieldDependencyInfo
];
