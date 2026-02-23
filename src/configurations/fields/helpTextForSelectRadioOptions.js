import { __ } from '@wordpress/i18n';
export const helpTextForSelectRadioOptions = __('An array of objects containing the value and label of the options. Label and value. Such as "Option 1 : option_1, Option 2 : option_2" \n' +
    'For dynamic options, you can use the following keywords to fetch data from the WordPress Core Data Package (@wordpress/core-data):\n' +
    '{{users}} - User List\n' +
    '{{posts}} - Post List\n' +
    '{{pages}} - Page List\n' +
    '{{taxonomies}} - Taxonomy List\n' +
    '{{categories}} - Category List\n' +
    '{{tags}} - Tag List\n' +
    '{{menus}} - Menu List\n' +
    '{{roles}} - Role List\n' +
    '{{post_types}} - Post Type List\n' +
    'Parameter support at REST API format:\n' +
    '{{users?role=admin&per_page=10}}\n' +
    '{{posts?author=admin&per_page=10}}\n' +
    '{{taxonomies?type=post}}', 'native-custom-fields');