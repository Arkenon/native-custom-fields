import { __ } from '@wordpress/i18n';

/**
 * Help text shown under the "options" field of select / radio / combobox / toggle group.
 *
 * Keep this in sync with `src/common/optionsHelper.js`, which is what actually
 * parses these strings and resolves the dynamic tokens through @wordpress/core-data.
 * Line breaks are rendered by the `white-space: pre-wrap` rule in common.scss.
 */
export const helpTextForSelectRadioOptions = __(
    '— STATIC OPTIONS —\n' +
    'Write them as "Label : value", separated by commas:\n' +
    'Option 1 : option_1, Option 2 : option_2\n' +
    'If the ":" part is omitted, the text is used as both label and value.\n' +
    '\n' +
    '— DYNAMIC OPTIONS —\n' +
    'Use a {{token}} to pull options from WordPress data.\n' +
    'Static text is ignored as soon as the field contains a {{token}}, so do not mix the two.\n' +
    'Several tokens can be combined; their results are merged into one list:\n' +
    '{{pages}} {{posts?type=book}}\n' +
    '\n' +
    '— AVAILABLE TOKENS —\n' +
    '{{posts}} · posts, label = title, value = ID\n' +
    '{{pages}} · pages, label = title, value = ID\n' +
    '{{users}} · users, label = display name, value = ID\n' +
    '{{categories}} · categories, label = name, value = term ID\n' +
    '{{tags}} · tags, label = name, value = term ID\n' +
    '{{menus}} · navigation menus, label = title, value = ID\n' +
    '{{taxonomies}} · taxonomy list, label = name, value = slug\n' +
    '{{post_types}} · post type list, label = singular name, value = slug\n' +
    '\n' +
    '— CUSTOM POST TYPES —\n' +
    'Use the "type" parameter with {{posts}} and pass the post type slug:\n' +
    '{{posts?type=book}}\n' +
    '{{posts?type=product&per_page=50&orderby=title&order=asc}}\n' +
    '"type" is not sent to the REST API; it selects which post type is queried.\n' +
    'Without it, {{posts}} queries "post" and {{pages}} queries "page".\n' +
    '\n' +
    '— PARAMETERS —\n' +
    'Everything after "?" is passed to the REST API endpoint of that resource,\n' +
    'so any argument that endpoint supports can be used:\n' +
    '{{posts?type=book&per_page=100&status=publish}}\n' +
    '{{users?roles=administrator&per_page=10}}\n' +
    '{{categories?per_page=100&orderby=name&hide_empty=true}}\n' +
    '{{taxonomies?type=post}}\n' +
    'Note: "author" expects a user ID, not a login name — {{posts?author=5}}\n' +
    '\n' +
    '— HOW MANY ITEMS —\n' +
    'REST returns 10 items per request by default and never more than 100,\n' +
    'so "per_page=500" or "per_page=-1" is capped at 100 rather than failing.\n' +
    'Use the combobox field for lists that do not fit: what you type there is\n' +
    'sent to the server as a search, so the whole collection stays reachable.\n' +
    'Select and radio show one page only, so keep them for short lists.\n' +
    '\n' +
    '— TAXONOMY TERMS —\n' +
    '{{taxonomies}} returns the list of taxonomies, not their terms.\n' +
    'Only category and tag terms can be listed, via {{categories}} and {{tags}}.',
    'native-custom-fields'
);
