/**
 * @deprecated This file is deprecated and will be removed in future versions.
 * TreeViewForm now uses field-configurations.js directly.
 * This was used by the old EditOrSaveUserMetaFields.js component.
 */

import {__} from "@wordpress/i18n";
import {fieldConfigurations} from "@nativecustomfields/configurations/field-configurations.js";

export const userMetaFieldsConfigurations = [
	{
		section_name: 'native_custom_fields_create_user_meta_fields',
		section_title: __('User Meta Fields', 'native-custom-fields'),
		fields: [
			{
				fieldType: 'repeater',
				name: 'user_meta_fields',
				fieldLabel: __('Fields', 'native-custom-fields'),
				addButtonText: __('Add New Field', 'native-custom-fields'),
				initialOpen: false,
				required: true,
				fields: fieldConfigurations
			}
		]
	}
];
