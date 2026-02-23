import { __ } from "@wordpress/i18n";
import { Button, Flex, FlexItem } from "@wordpress/components";
import { chevronLeft } from "@wordpress/icons";
import TreeViewForm from "@nativecustomfields/components/TreeViewForm/TreeViewForm";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const EditOrSavePostMetaField = () => {
	const urlParams = new URLSearchParams(window.location.search);

	// Get related Post Type slug
	let post_type_slug = urlParams.get('post_type_slug');
	const builder_form_menu_slug = post_type_slug ? `native_custom_fields_post_meta_fields_builder_${post_type_slug}` : 'native_custom_fields_post_meta_fields_builder';

	const [initialFields, setInitialFields] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (post_type_slug) {
			// Load existing fields from backend
			fetchExistingFields().then((res)=>{
				setInitialFields(res);
			});
		} else {
			setIsLoading(false);
		}
	}, [post_type_slug]);

	const fetchExistingFields = async () => {
		try {
			// Get existing configuration from backend for builder form
			const response = await apiFetch({
				path: `/native-custom-fields/v1/post-meta/get-post-meta-config-by-post-type?post_type=${post_type_slug}`,
				method: 'GET',
			});

			// Extract sections_or_meta_boxes from response.config_model.values
			if (response && response.status && response.config_model && response.config_model.values && response.config_model.values.sections_or_meta_boxes) {
				return response.config_model.values.sections_or_meta_boxes;
			}

			// If no meta boxes found, return empty array
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

			// Add post_type to values
			const dataToSave = {
				...values,
				post_type: post_type_slug
			};

			// Save fields configuration for post meta fields
			await apiFetch({
				path: '/native-custom-fields/v1/post-meta/save-post-meta-fields-config',
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

	const handleBackToList = () => {
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.delete('step');
		currentUrl.searchParams.delete('edit');
		currentUrl.searchParams.delete('post_type_slug');
		window.location.href = currentUrl.toString();
	};

	return !isLoading && (
		<>
			<div className="native-custom-fields-mt-20">
				<Flex justify="space-between" align="center">
					<FlexItem>
						<Button
							variant="secondary"
							icon={chevronLeft}
							onClick={handleBackToList}
						>
							{__('Back to List', 'native-custom-fields')}
						</Button>
					</FlexItem>
				</Flex>
			</div>
			<TreeViewForm
				menuSlug={builder_form_menu_slug}
				pageTitle={ __('Edit Meta Fields', 'native-custom-fields')}
				initialFields={initialFields}
				onSave={handleSave}
				isPostType={true}
				contextType="post_type"
				contextValue={post_type_slug}
			/>
		</>
	);
};

export default EditOrSavePostMetaField;
