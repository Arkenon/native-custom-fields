import { __ } from "@wordpress/i18n";
import { Button, Flex, FlexItem } from "@wordpress/components";
import { chevronLeft } from "@wordpress/icons";
import TreeViewForm from "@nativecustomfields/components/TreeViewForm/TreeViewForm";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const EditOrSaveTermMetaFields = () => {
	const urlParams = new URLSearchParams(window.location.search);

	// Get related Taxonomy slug
	let taxonomy_slug = urlParams.get('taxonomy_slug');
	const builder_form_menu_slug = taxonomy_slug ? `native_custom_fields_term_meta_fields_builder_${taxonomy_slug}` : 'native_custom_fields_term_meta_fields_builder';

	const [initialFields, setInitialFields] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (taxonomy_slug) {
			// Load existing fields from backend
			fetchExistingFields().then((res)=>{
				setInitialFields(res);
			});
		} else {
			setIsLoading(false);
		}
	}, [taxonomy_slug]);

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

			// Add taxonomy to values
			const dataToSave = {
				...values,
				taxonomy: taxonomy_slug
			};

			// Save fields configuration for term meta fields
			await apiFetch({
				path: '/native-custom-fields/v1/term-meta/save-term-meta-fields-config',
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
		currentUrl.searchParams.delete('taxonomy_slug');
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
				pageTitle={ __('Edit Term Meta Fields', 'native-custom-fields')}
				initialFields={initialFields}
				onSave={handleSave}
				isPostType={false}
				contextType="taxonomy"
				contextValue={taxonomy_slug}
			/>
		</>
	);
};

export default EditOrSaveTermMetaFields;
