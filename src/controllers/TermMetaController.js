import {__ } from '@wordpress/i18n';
import {createRoot, useEffect, useState} from '@wordpress/element';

/**
 * Internal dependencies
 */

import {fieldInitializationError, updateHiddenInputValue, validateFields} from "@nativecustomfields/common/helper.js";
import RenderFields from "@nativecustomfields/render/RenderFields.js";
import EditOrSaveTaxonomy from "@nativecustomfields/admin/pages/create-term-meta/EditOrSaveTaxonomy.js";
import TaxonomyListTable from "@nativecustomfields/admin/pages/create-term-meta/TaxonomyListTable.js";
import EditOrSaveTermMetaFields from "@nativecustomfields/admin/pages/create-term-meta/EditOrSaveTermMetaFields.js";

export const renderTermMetaFields = () => {
	// Initialize term meta fields for all sections
	const termMetaWrappers = document.querySelectorAll('.native-custom-fields-term-meta-wrapper');

	// For checking out the required fields - using Map to track validity per wrapper
	const fieldsValidityMap = new Map();


	// Add form submit validation for edit form (edittag)
	const editForm = document.getElementById('edittag');
	if (editForm) {
		editForm.addEventListener('submit', (e) => {
			// Check if any wrapper has invalid fields
			const hasInvalidFields = Array.from(fieldsValidityMap.values()).some(isValid => !isValid);

			if (hasInvalidFields) {
				e.preventDefault();
				alert(__('Please fill in all required fields before submitting.', 'native-custom-fields'));

				const submitBtn = editForm.querySelector('.button-primary');
				if (submitBtn) submitBtn.classList.remove('disabled');
			}
		});
	}

	// Add form submit validation for add form (addtag)
	const addForm = document.getElementById('addtag');
	if (addForm) {
		// Listen to both submit event and button click
		addForm.addEventListener('submit', (e) => {
			// Check if any wrapper has invalid fields
			const hasInvalidFields = Array.from(fieldsValidityMap.values()).some(isValid => !isValid);

			if (hasInvalidFields) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				alert(__('Please fill in all required fields before submitting.', 'native-custom-fields'));

				const submitBtn = addForm.querySelector('.button-primary');
				if (submitBtn) {
					submitBtn.classList.remove('disabled');
					submitBtn.removeAttribute('disabled');
				}
				return false;
			}
		}, true); // Use capture phase

		// Also add click listener to submit button as backup
		const submitBtn = addForm.querySelector('#submit');
		if (submitBtn) {
			submitBtn.addEventListener('click', (e) => {
				// Check if any wrapper has invalid fields
				const hasInvalidFields = Array.from(fieldsValidityMap.values()).some(isValid => !isValid);

				if (hasInvalidFields) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
					alert(__('Please fill in all required fields before submitting.', 'native-custom-fields'));
					return false;
				}
			}, true); // Use capture phase
		}
	}

	termMetaWrappers.forEach((termMetaWrapper, index) => {
		try {
			const fields = JSON.parse(termMetaWrapper.dataset.fields || '[]');
			const initialValues = JSON.parse(termMetaWrapper.dataset.values || '{}');
			const wrapperId = `wrapper-${index}`;

			// Initialize validity for this wrapper
			fieldsValidityMap.set(wrapperId, true);

			if (!fields.length) {
				console.error(__('No term fields configuration found', 'native-custom-fields'))
			}

			// Component to render fields with state management
			const TermMetaFieldsComponent = () => {
				const [values, setValues] = useState(initialValues || {});

				// Update values when initialValues change
				useEffect(() => {
					setValues(initialValues || {});
				}, [initialValues]);

				// Validate fields on value change
				useEffect(() => {
					const isValid = validateFields(fields, values);
					fieldsValidityMap.set(wrapperId, isValid);
				}, [values]);

				// Handle field value changes
				const handleChange = (name, value) => {
					// Update local state
					setValues(prev => ({
						...prev,
						[name]: value
					}));

					// Find the hidden input specifically (not the checkbox/radio input)
					const input = document.querySelector(`input[type="hidden"][name="${name}"]`);

					// Find the field type for this field
					const field = fields.find(f => f.name === name);
					const fieldType = field ? field.fieldType : '';

					updateHiddenInputValue(name, value, input, fieldType);
				};

				return (
					<RenderFields
						fields={fields}
						values={values}
						onChange={handleChange}
					/>
				);
			};

			const root = createRoot(termMetaWrapper);
			root.render(<TermMetaFieldsComponent />);
		} catch (error) {
			fieldInitializationError(error);
		}
	});
};

export const renderCreateTermMeta = () => {
	const wrapper = document.querySelector('.native-custom-fields-term-meta-builder-wrapper');
	// Get URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const step = urlParams.get('step');

	if (wrapper) {
		const root = createRoot(wrapper);
		root.render(
			<>
				{
					step === 'edit-or-save-term-meta-fields' ? <EditOrSaveTermMetaFields/> :
						step === 'edit-or-save-taxonomy' ? <EditOrSaveTaxonomy/> :
							<div className="native-custom-fields-app">
								<TaxonomyListTable/>
							</div>
				}
			</>
		);
	}
}
