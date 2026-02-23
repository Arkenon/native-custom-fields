/**
 * @deprecated This file is deprecated and will be removed in future versions.
 * TreeViewForm now uses field-configurations.js directly.
 * This was used by the old EditOrSaveTermMetaFields.js component.
 */

import {__} from "@wordpress/i18n";
import {fieldConfigurations} from "@nativecustomfields/configurations/field-configurations.js";

const urlParams = new URLSearchParams(window.location.search);
const taxonomy_slug = urlParams.get('taxonomy_slug');
export const termMetaFieldsConfigurations = [
    {
        section_name: 'native_custom_fields_create_term_meta_fields',
        section_title: __('Term Meta Fields', 'native-custom-fields'),
        fields: [
			{
				fieldType: 'text',
				name: 'taxonomy',
				fieldLabel: __('Taxonomy Slug', 'native-custom-fields'),
				default: taxonomy_slug,
				disabled: true,
			},
			{
				fieldType: 'repeater',
				name: 'term_meta_fields',
				fieldLabel: __('Fields', 'native-custom-fields'),
				addButtonText: __('Add New Field', 'native-custom-fields'),
				initialOpen: false,
				required: true,
				fields: fieldConfigurations
			}
        ]
    }
];
