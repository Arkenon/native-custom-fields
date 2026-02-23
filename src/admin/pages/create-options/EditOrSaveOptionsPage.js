import {__} from "@wordpress/i18n";
import {optionsPagesConfigurations} from "@nativecustomfields/configurations/options/options-pages-configurations.js";
import {Button, Flex, FlexItem} from "@wordpress/components";
import {chevronLeft} from "@wordpress/icons";
import {DataForm} from "@nativecustomfields/components";

const EditOrSaveOptionsPage = () => {

	const urlParams = new URLSearchParams(window.location.search);
	const isEdit = urlParams.get('edit');
	const pageTitle = isEdit ? __('Edit Options Page', 'native-custom-fields') : __('Create Options Page', 'native-custom-fields');
	let menu_slug = urlParams.get('menu_slug');

	menu_slug = isEdit ? `native_custom_fields_options_page_builder_${menu_slug}` : 'native_custom_fields_options_page_builder';

	const handleBackToList = () => {
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.delete('step');
		currentUrl.searchParams.delete('edit');
		currentUrl.searchParams.delete('menu_slug');
		window.location.href = currentUrl.toString();
	};

	return (
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

			<DataForm
				_menuSlug={menu_slug}
				_pageTitle={pageTitle}
				_isBuilderOptions={true}
				_builderType='optionsPage'
				_sections={optionsPagesConfigurations}
				_layout='stacked'
				_resetForm={false}
				_redirectTo={window.nativeCustomFieldsData.admin_url + '/admin.php?page=native-custom-fields-options-page-builder'}
			/>
		</>

	);
}

export default EditOrSaveOptionsPage;
