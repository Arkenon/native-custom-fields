import { __ } from "@wordpress/i18n";
import TreeViewForm from "@nativecustomfields/components/TreeViewForm/TreeViewForm";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const EditOrSaveUserMetaFields = () => {
	// User meta has a fixed menu slug (only for all_users role)
	const builder_form_menu_slug = 'native_custom_fields_user_meta_fields_builder_all_users';

	const [initialFields, setInitialFields] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Load existing fields from backend
		fetchExistingFields().then((res) => {
			setInitialFields(res);
		});
	}, []);

	const fetchExistingFields = async () => {
		try {
			// Get existing configuration from backend for builder form (using options endpoint)
			const response = await apiFetch({
				path: `/native-custom-fields/v1/options/get-options-page-config-by-menu-slug?menu_slug=${builder_form_menu_slug}`,
				method: 'GET',
			});

			// Extract sections_or_meta_boxes from response.config_model.values
			if (response && response.status && response.config_model && response.config_model.values && response.config_model.values.sections_or_meta_boxes) {
				return response.config_model.values.sections_or_meta_boxes;
			}

			// If no sections found, return empty array
			return [];
		} catch (error) {
			console.error('Error loading fields:', error);
			return [];
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async (values) => {
		try {
			const dataToSave = {
				...values
			};

			// Save fields configuration for user meta fields
			await apiFetch({
				path: '/native-custom-fields/v1/user-meta/save-user-meta-fields-config',
				method: 'POST',
				data: {
					menu_slug: builder_form_menu_slug,
					values: dataToSave
				}
			});

			// Save the actual options values of builder form
			await apiFetch({
				path: '/native-custom-fields/v1/options/save-options',
				method: 'POST',
				data: {
					menu_slug: builder_form_menu_slug,
					values: dataToSave
				}
			});

		} catch (error) {
			console.error('Error saving fields:', error);
		}
	};

	return !isLoading && (
		<>
			<TreeViewForm
				menuSlug={builder_form_menu_slug}
				pageTitle={__('Edit User Meta Fields', 'native-custom-fields')}
				initialFields={initialFields}
				onSave={handleSave}
				isPostType={false}
				contextType="user"
			/>
		</>
	);
};

export default EditOrSaveUserMetaFields;
