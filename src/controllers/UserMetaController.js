import {__ } from '@wordpress/i18n';
import {createRoot, useEffect, useState} from '@wordpress/element';
import {fieldInitializationError, updateHiddenInputValue, validateFields} from "@nativecustomfields/common/helper.js";
import RenderFields from "@nativecustomfields/render/RenderFields.js";
import EditOrSaveUserMetaFields from "@nativecustomfields/admin/pages/create-user-meta/EditOrSaveUserMetaFields.js";

export const renderUserMetaFields = () => {
	// Initialize user meta fields for all sections
	const userMetaWrappers = document.querySelectorAll('.native-custom-fields-user-meta-wrapper');

	// For checking out the required fields - using Map to track validity per wrapper
	const fieldsValidityMap = new Map();

	// Add form submit validation for user forms
	// User profile edit form (profile.php)
	const profileForm = document.getElementById('your-profile');
	if (profileForm) {
		profileForm.addEventListener('submit', (e) => {
			// Check if any wrapper has invalid fields
			const hasInvalidFields = Array.from(fieldsValidityMap.values()).some(isValid => !isValid);

			if (hasInvalidFields) {
				e.preventDefault();
				alert(__('Please fill in all required fields before submitting.', 'native-custom-fields'));

				const submitBtn = profileForm.querySelector('#submit');
				if (submitBtn) {
					submitBtn.classList.remove('disabled');
					submitBtn.removeAttribute('disabled');
				}
			}
		});
	}

	// User edit form (user-edit.php)
	const userEditForm = document.getElementById('createuser') || document.getElementById('your-profile');
	if (userEditForm && userEditForm.id === 'createuser') {
		userEditForm.addEventListener('submit', (e) => {
			// Check if any wrapper has invalid fields
			const hasInvalidFields = Array.from(fieldsValidityMap.values()).some(isValid => !isValid);

			if (hasInvalidFields) {
				e.preventDefault();
				alert(__('Please fill in all required fields before submitting.', 'native-custom-fields'));

				const submitBtn = userEditForm.querySelector('#createusersub');
				if (submitBtn) {
					submitBtn.classList.remove('disabled');
					submitBtn.removeAttribute('disabled');
				}
			}
		});
	}

	userMetaWrappers.forEach((userMetaWrapper, index) => {
		try {
			const fields = JSON.parse(userMetaWrapper.dataset.fields || '[]');
			const initialValues = JSON.parse(userMetaWrapper.dataset.values || '{}');
			const wrapperId = `wrapper-${index}`;

			// Initialize validity for this wrapper
			fieldsValidityMap.set(wrapperId, true);

			if (!fields.length) {
				console.error(__('No user meta fields configuration found', 'native-custom-fields'))
			}

			// Component to render fields with state management
			const UserMetaFieldsComponent = () => {
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

			const root = createRoot(userMetaWrapper);
			root.render(<UserMetaFieldsComponent />);
		} catch (error) {
			fieldInitializationError(error);
		}
	});
};

export const renderCreateUserMeta = () => {
	const wrapper = document.querySelector('.native-custom-fields-user-meta-builder-wrapper');
	if (wrapper) {
		const root = createRoot(wrapper);
		root.render(
				<EditOrSaveUserMetaFields />
		);
	}
}
