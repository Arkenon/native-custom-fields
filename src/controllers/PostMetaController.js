import {
	fieldInitializationError,
	noFieldConfigurationFound,
	updateHiddenInputValue,
	validateFields
} from "@nativecustomfields/common/helper.js";
import { subscribe, select, dispatch } from '@wordpress/data';
import {createRoot, useEffect, useState} from "@wordpress/element";
import RenderFields from "@nativecustomfields/render/RenderFields.js";
import EditOrSavePostType from "@nativecustomfields/admin/pages/create-post-meta/EditOrSavePostType.js";
import PostTypesListTable from "@nativecustomfields/admin/pages/create-post-meta/PostTypesListTable.js";
import EditOrSavePostMetaField from "@nativecustomfields/admin/pages/create-post-meta/EditOrSavePostMetaFields.js";
import {__} from "@wordpress/i18n";


export const renderPostMetaFields = () => {
	// Initialize meta boxes for post meta fields
	const postMetaWrappers = document.querySelectorAll('.native-custom-fields-post-meta-wrapper');
	const isBlockEditor = () => typeof wp !== 'undefined' && wp.data && select('core/editor');

	// For checking out the required fields. We need to lock the post-saving process when the fields are not valid.
	const LOCK_ID = 'nativecustomfields_validation_lock';
	let isFieldsValid = true;

	const applyValidation = (isValid) => {
		isFieldsValid = isValid;

		if (isBlockEditor()) {
			const { isPostSavingLocked } = select('core/editor');
			if (!isValid && !isPostSavingLocked(LOCK_ID)) {
				dispatch('core/editor').lockPostSaving(LOCK_ID);
				wp.data.dispatch('core/notices').createErrorNotice(
					__('Please fill in all required fields before submitting.', 'native-custom-fields'),
					{
						id: LOCK_ID,
						isDismissible: true,
					}
				);
			} else if (isValid && isPostSavingLocked(LOCK_ID)) {
				dispatch('core/editor').unlockPostSaving(LOCK_ID);
				wp.data.dispatch('core/notices').removeNotice(LOCK_ID);
			}
		}
	};

	if (!isBlockEditor()) {
		const postForm = document.getElementById('post');
		if (postForm) {
			postForm.addEventListener('submit', (e) => {
				if (!isFieldsValid) {
					e.preventDefault();
					alert(__('Please fill in all required fields before submitting.', 'native-custom-fields'));

					const spinner = document.querySelector('#major-publishing-actions .spinner');
					if (spinner) spinner.classList.remove('is-active');
					const submitBtn = document.getElementById('publish');
					if (submitBtn) submitBtn.classList.remove('disabled');
				}
			});
		}
	}

	postMetaWrappers.forEach(postMetaWrapper => {
		try {
			const fields = JSON.parse(postMetaWrapper.dataset.fields || '[]');
			const initialValues = JSON.parse(postMetaWrapper.dataset.values || '{}');

			if (!fields.length) {
				noFieldConfigurationFound();
			}

			// Component to render fields with state management
			const PostMetaFieldsComponent = () => {
				const [values, setValues] = useState(initialValues || {});

				// Update values when initialValues change
				useEffect(() => {
					setValues(initialValues || {});
				}, [initialValues]);

				useEffect(() => {
					const isValid = validateFields(fields, values);
					applyValidation(isValid);
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

			const root = createRoot(postMetaWrapper);
			root.render(<PostMetaFieldsComponent />);
		} catch (error) {
			fieldInitializationError(error);
		}
	});
};

export const renderCreatePostMeta = () => {
	const wrapper = document.querySelector('.native-custom-fields-post-meta-builder-wrapper');
	// Get URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const step = urlParams.get('step');
	if (wrapper) {
		const root = createRoot(wrapper);
		root.render(
			<>
				{
					step === 'edit-or-save-post-meta-fields' ? <EditOrSavePostMetaField/> :
						step === 'edit-or-save-post-type' ? <EditOrSavePostType/> :
							<div className="native-custom-fields-app">
								<PostTypesListTable/>
							</div>
				}
			</>
		);
	}
}
