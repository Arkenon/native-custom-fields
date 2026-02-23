/**
 * Native Custom Fields - Render Data Form Component
 * Responsible for rendering fields as a data form in Options Pages (Maybe extended for meta boxes in the future)
 * All data forms are rendered as a regular Options Page, so the data is fetched from the options table
 * @package native-custom-fields
 * @version 1.0.0
 *
 */


/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {useEffect, useState} from '@wordpress/element';
import {Notice} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import {validateRequiredFields} from '@nativecustomfields/common/helper';
import {ActionButtons, NavigationLayout, TabPanelLayout, StackedSectionsLayout} from '@nativecustomfields/components';
import ToggleGroupField from "@nativecustomfields/components/ToggleGroup/ToggleGroupField.js";

/**
 * Render fields as a form
 * All data forms are rendered as a regular Options Page, so the data is fetched from the options table
 * @param {Object} props Component properties
 * @param {string} props._menuSlug Menu slug of the options page
 * @param {string} props._pageTitle Page title of the options page
 * @param {Array} props._sections Sections of the options page
 * @param {string} props._layout Layout type of the options page (e.g., 'navigation', 'tab_panel', 'single_section')
 * @param {Object} props._values Values for the options page fields
 * @param {boolean} props._isBuilderOptions Whether the options page is for the builder (created by plugin itself) (Private)
 * @param {string|null} props._builderType Type of builder (e.g., 'optionsPage', 'optionsPageFields', 'postType', 'postMetaFields') (Private)
 * @param {boolean} props._resetForm Whether to show reset form and reset section buttons
 * @param {string|null} props._redirectTo URL to redirect after saving the options
 * @returns {React.ReactElement} App component
 */
const DataForm = (
	{
		_menuSlug,
		_pageTitle,
		_sections = [],
		_layout = 'single_section',
		_values = {},
		_isBuilderOptions = false,
		_builderType = null,
		_resetForm = true,
		_redirectTo = null
	}
) => {
	const [sections, setSections] = useState(_sections);
	const [layout, setLayout] = useState(_layout);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [values, setValues] = useState(_values);
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState(null);
	const [hasChanges, setHasChanges] = useState(false);
	const [activeSection, setActiveSection] = useState(null);
	const [pageTitle, setPageTitle] = useState(_pageTitle);

	// Load initial data
	useEffect(() => {

		if (!_menuSlug) return;

		loadData().then((response) => {
			if (!response || !response.status) {
				setError(response?.message || __('Unexpected error', 'native-custom-fields'));
			} else {
				// If options page is not created by the plugin itself
				if (!_isBuilderOptions) {
					// If layout is provided, use it
					if (response.config_model.layout && response.config_model.layout !== '') {
						setLayout(response.config_model.layout);
					}

					if (response.config_model.sections.length > 0) {
						setSections(response.config_model.sections);

						// If values are provided, use them
						if (Object.keys(response.config_model.values).length > 0) {
							setValues(response.config_model.values);
						} else {
							// Else initialize values from the sections
							setValues(initializeValuesFromConfig(response.config_model.sections));
						}

					} else {
						setError(__('No fields found.', 'native-custom-fields'));

					}

				} else {
					// Else if options page is created by the user
					// If values are provided, use them
					if (Object.keys(response.config_model.values).length > 0) {
						setValues(response.config_model.values);
					} else {
						// Else initialize values from the sections
						setValues(initializeValuesFromConfig(sections));
					}
				}
			}
		});

	}, []);

	/**
	 * Fetches the options page configuration data from the server.
	 * @returns {Promise<unknown>}
	 */
	const loadData = async () => {
		try {
			return await apiFetch({
				path: `/native-custom-fields/v1/options/get-options-page-config-by-menu-slug?menu_slug=${_menuSlug}`
			});
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Processes a given array of sections and converts it into an object
	 * containing field names and their default values. It works recursively
	 * for 'group' and 'repeater' field types.
	 *
	 * @param {Array} fieldsArray - The array of fields to be processed.
	 * @returns {Object} An object consisting of field names and their default values.
	 */
	const processFields = (fieldsArray) => {
		const data = {};

		for (const field of fieldsArray) {
			// Skip if the field doesn't have a name (e.g., it might be an unnamed wrapper)
			if (!field.name) {
				continue;
			}

			// Process based on the field type
			if (field.fieldType === 'repeater') {
				const repeaterItems = [];
				// If there's a 'min' property, create that many default items.
				const minItems = field.min || 0;

				for (let i = 0; i < minItems; i++) {
					// Call the function again for the fields inside the repeater (recursion)
					repeaterItems.push(processFields(field.fields));
				}
				data[field.name] = repeaterItems;

			} else if (field.fieldType === 'group') {
				// Call the function again for the fields inside the group (recursion)
				data[field.name] = processFields(field.fields);

			} else {
				// For simple fields (text, toggle, etc.)
				// Use the 'default' value if it exists, otherwise assign null.
				data[field.name] = field.default !== undefined ? field.default : null;
			}
		}

		return data;
	};

	/**
	 * Takes the main 'fields' array and creates the final 'values' object
	 * containing the default values for each section.
	 *
	 * @param {Array} sections The main array containing the configuration data of sections.
	 * @returns {Object} The 'values' object created in the desired format.
	 */
	const initializeValuesFromConfig = (sections) => {

		const finalValues = {};

		for (const section of sections) {
			// Create a new entry for each section and process its fields
			finalValues[section.section_name] = {
				...processFields(section.fields)
			};
		}

		return finalValues;
	};

	const handleSectionChange = (sectionName) => {
		setActiveSection(sectionName);
	};

	// Handle form value changes
	const handleChange = (name, value) => {

		setValues(prev => {
			// Creating a deep copy is safer when working with nested objects.
			const newValues = JSON.parse(JSON.stringify(prev));

			// Find which section the field belongs to.
			for (const section of sections) {
				// List the fields that will be checked for the change.
				const fieldInSection = new Set(section.fields.map(f => f.name));

				// Does the changed field belong to this section?
				if (fieldInSection.has(name)) {
					// Initialize section if it doesn't exist, is an array, or is not an object
					if (!newValues[section.section_name] ||
						Array.isArray(newValues[section.section_name]) ||
						typeof newValues[section.section_name] !== 'object') {
						newValues[section.section_name] = {};
					}

					const currentValue = newValues[section.section_name][name];
					const isSameValue = JSON.stringify(currentValue) === JSON.stringify(value);
					if (isSameValue) {
						return prev; // Ignore no-op updates so hasChanges stays false
					}


					// Update the value in the correct section.
					newValues[section.section_name][name] = value;

					// The change has been made, so the loop can be exited.
					setHasChanges(true);

					return newValues;
				}
			}

			// If it doesn't belong to any section (unexpected situation), keep the old value.
			return prev;
		});
	};

	// Handle form submission
	const handleSave = async () => {

		if (!hasChanges) return;
		setIsSaving(true);
		setSaveMessage(null);

		const validate = validateRequiredFields(sections, values);

		if (!validate.isValid) {
			setSaveMessage({
				type: 'error',
				content: validate.message
			});
			setIsSaving(false);
			return;
		}

		try {

			let response = {
				status: false,
				message: null
			}

			const saveData = async (path, menuSlug) => {
				let response;
				try {
					response = await apiFetch({
						path: path,
						method: 'POST',
						data: {
							menu_slug: menuSlug,
							values: values
						}
					});
				} catch (err) {
					response = {status: false, message: err.message};
				}
				return response;
			}

			if (!_isBuilderOptions) {
				// If it's a regular options page, set the response from saving options
				response = await saveData('/native-custom-fields/v1/options/save-options', _menuSlug);

			} else {
				// If it's a builder page, save configuration data as well
				switch (_builderType) {
					case 'optionsPage':
						const saveOptionsPageConfig = await saveData('/native-custom-fields/v1/options/save-option-pages-config', _menuSlug);

						if (saveOptionsPageConfig.status) {
							//Save builder data as separate options page data
							const get_menu_slug = values.native_custom_fields_create_options_page.menu_slug;
							const builder_menu_slug = 'native_custom_fields_options_page_builder_' + get_menu_slug;

							response = await saveData('/native-custom-fields/v1/options/save-options', builder_menu_slug);
						}
						break;
					/*	case 'optionsPageFields':
							const saveOptionsPageFieldsConfig = await saveData('/native-custom-fields/v1/options/save-option-page-fields-config', _menuSlug);

							if (saveOptionsPageFieldsConfig.status) {
								response = await saveData('/native-custom-fields/v1/options/save-options', _menuSlug);
							}
							break;*/
					case 'postType':
						const savePostTypeConfig = await saveData('/native-custom-fields/v1/post-meta/save-post-type-config', _menuSlug);

						if (savePostTypeConfig.status) {
							//Save builder data as separate options page data
							const get_menu_slug = values.native_custom_fields_create_post_type_general.post_type;
							const builder_menu_slug = 'native_custom_fields_post_type_builder_' + get_menu_slug;

							response = await saveData('/native-custom-fields/v1/options/save-options', builder_menu_slug);
						}
						break;
					/*case 'postMetaFields':
						const savePostMetaFieldsConfig = await saveData('/native-custom-fields/v1/post-meta/save-post-meta-fields-config', _menuSlug);

						if (savePostMetaFieldsConfig.status) {
							response = await saveData('/native-custom-fields/v1/options/save-options', _menuSlug);
						}
						break;*/
					case 'customTaxonomy':
						const saveCustomTaxonomyConfig = await saveData('/native-custom-fields/v1/term-meta/save-custom-taxonomy-config', _menuSlug);

						if (saveCustomTaxonomyConfig.status) {
							const get_menu_slug = values.native_custom_fields_create_taxonomy_general.taxonomy;
							const builder_menu_slug = 'native_custom_fields_taxonomy_builder_' + get_menu_slug;
							response = await saveData('/native-custom-fields/v1/options/save-options', builder_menu_slug);
						}
						break;
					/*	case 'termMetaFields':
							const saveTermMetaFieldsConfig = await saveData('/native-custom-fields/v1/term-meta/save-term-meta-fields-config', _menuSlug);

							if (saveTermMetaFieldsConfig.status) {
								response = await saveData('/native-custom-fields/v1/options/save-options', _menuSlug);
							}
							break;*/
					/*	case 'userMetaFields':
							const saveUserMetaFieldsConfig = await saveData('/native-custom-fields/v1/user-meta/save-user-meta-fields-config', _menuSlug);

							if (saveUserMetaFieldsConfig.status) {
								response = await saveData('/native-custom-fields/v1/options/save-options', _menuSlug);
							}
							break;*/
				}
			}

			if (response.status) {
				setSaveMessage({
					type: 'success',
					content: response.message
				});
				setHasChanges(false);

				// If _redirectTo is provided, redirect to that URL
				if (_redirectTo !== null) {
					window.location = _redirectTo;
				}
			} else {
				setSaveMessage({
					type: 'error',
					content: response.message || __('Failed to save options.', 'native-custom-fields')
				});
			}
		} catch (err) {
			setSaveMessage({
				type: 'error',
				content: err.message || __('An error occurred!', 'native-custom-fields')
			});
		} finally {
			setIsSaving(false);
		}
	};

	// Handle form reset
	const handleResetAll = async () => {
		if (window.confirm(__('Are you sure you want to reset all settings?', 'native-custom-fields'))) {
			setIsSaving(true);
			setSaveMessage(null);

			try {
				// Reset values in the database by sending empty values
				const response = await apiFetch({
					path: '/native-custom-fields/v1/options/save-options',
					method: 'POST',
					data: {
						menu_slug: _menuSlug,
						values: {},
						reset: true
					}
				});

				if (response.status) {
					window.location.reload();
				} else {
					setSaveMessage({
						type: 'error',
						content: response.message || __('Failed to reset settings.', 'native-custom-fields')
					});
				}
			} catch (err) {
				setSaveMessage({
					type: 'error',
					content: err.message || __('Failed to reset settings.', 'native-custom-fields')
				});
			} finally {
				setIsSaving(false);
			}
		}
	};

	const handleResetSection = async (sectionName) => {
		if (!sectionName || !window.confirm(__('Are you sure you want to reset this section?', 'native-custom-fields'))) {
			return;
		}

		setIsSaving(true);
		setSaveMessage(null);

		try {
			const currentResponse = await apiFetch({
				path: `/native-custom-fields/v1/options/get-options-page-config-by-menu-slug?menu_slug=${_menuSlug}`
			});

			const currentValues = currentResponse.config_model.values || {};

			const updatedValues = {...currentValues};
			updatedValues[sectionName] = {};

			const response = await apiFetch({
				path: '/native-custom-fields/v1/options/save-options',
				method: 'POST',
				data: {
					menu_slug: _menuSlug,
					values: updatedValues,
					reset: true,
				}
			});

			if (response.status) {
				window.location.reload();
			} else {
				setSaveMessage({
					type: 'error',
					content: response.message || __('Failed to reset section.', 'native-custom-fields')
				});
			}
		} catch (err) {
			setSaveMessage({
				type: 'error',
				content: err.message || __('Failed to reset section.', 'native-custom-fields')
			});
		} finally {
			setIsSaving(false);
		}
	};

	// Rendering error notice
	if (error) {
		return (
			<Notice
				className="native-custom-fields-notice"
				status="error"
				isDismissible={false}>
				{error}
			</Notice>
		);
	}

	const renderLayout = () => {
		const props = {
			sections,
			values,
			pageTitle,
			onChange: handleChange,
			onSectionChange: handleSectionChange
		};

		switch (layout) {
			case 'navigation':
				return <NavigationLayout {...props} />;
			case 'tab_panel':
				return <TabPanelLayout {...props} />;
			default:
				return <StackedSectionsLayout {...props} />;
		}
	};

	if (!loading) {
		return (
			<div className="native-custom-fields-app">
				{renderLayout()}
				{saveMessage && (
					<Notice
						className="native-custom-fields-notice"
						status={saveMessage.type}
						isDismissible={true}
						__unstableHTML={true}
						onRemove={() => setSaveMessage(null)}
					>
						{saveMessage.content}
					</Notice>
				)}
				<ActionButtons
					onResetAll={handleResetAll}
					onResetSection={() => handleResetSection(activeSection)}
					onSave={handleSave}
					isSaving={isSaving}
					hasChanges={hasChanges}
					resetSection={layout !== 'stacked'}
					resetForm={_resetForm}
				/>
			</div>
		);
	}
};

export default DataForm;
