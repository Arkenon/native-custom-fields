import {__} from '@wordpress/i18n';

const fieldCustomInfoDateTimePicker = {
    fieldType: 'group',
    name: 'field_custom_info_date_time_picker',
    fieldLabel: __('Field Custom Options', 'native-custom-fields'),
    layout: 'grid',
    fields: [
        {
            fieldType: 'text',
            name: 'currentDate',
            fieldLabel: __('Current Date', 'native-custom-fields'),
            inputType: 'datetime-local',
            fieldHelpText: __('The current date and time at initialization.', 'native-custom-fields')
        },
        {
            fieldType: 'radio',
            name: 'dateOrder',
            fieldLabel: __('Date Order', 'native-custom-fields'),
            fieldHelpText: __('The order of day, month, and year. This prop overrides the time format determined by is12Hour prop.', 'native-custom-fields'),
            default: 'dmy',
            options: [
                {label: __('Day, Month, Year', 'native-custom-fields'), value: 'dmy'},
                {label: __('Month, Day, Year', 'native-custom-fields'), value: 'mdy'},
                {label: __('Year, Month, Day', 'native-custom-fields'), value: 'ymd'}
            ]
        },
        {
            fieldType: 'select',
            name: 'startOfWeek',
            fieldLabel: __('Start of Week', 'native-custom-fields'),
            fieldHelpText: __('The day that the week should start on. 0 for Sunday, 1 for Monday, etc.', 'native-custom-fields'),
            default: 0,
            options: [
                {label: __('0', 'native-custom-fields'), value: 0},
                {label: __('1', 'native-custom-fields'), value: 1},
                {label: __('2', 'native-custom-fields'), value: 2},
                {label: __('3', 'native-custom-fields'), value: 3},
                {label: __('4', 'native-custom-fields'), value: 4},
                {label: __('5', 'native-custom-fields'), value: 5},
                {label: __('6', 'native-custom-fields'), value: 6}
            ]
        },
        {
            fieldType: 'toggle',
            name: 'is12Hour',
            fieldLabel: __('12 Hour Format', 'native-custom-fields'),
            fieldHelpText: __('Whether we use a 12-hour clock. With a 12-hour clock, an AM/PM widget is displayed and the time format is assumed to be MM-DD-YYYY (as opposed to the default format DD-MM-YYYY).', 'native-custom-fields'),
            default: false
        }
    ],
    dependencies: {
        relation: 'and',
        conditions: [
            {
                field: 'fieldType',
                operator: '===',
                value: 'date_time_picker'
            }
        ]
    }
}
export default fieldCustomInfoDateTimePicker;
