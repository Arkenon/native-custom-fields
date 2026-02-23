import {__} from "@wordpress/i18n";
import {postTypesConfigurations} from "@nativecustomfields/configurations/post-meta/post-types-configurations.js";
import {Button, Flex, FlexItem} from "@wordpress/components";
import {chevronLeft} from "@wordpress/icons";
import {DataForm} from "@nativecustomfields/components";

const EditOrSavePostType = () => {

	//Get
	const urlParams = new URLSearchParams(window.location.search);
	const isEdit = urlParams.get('edit');
	const pageTitle = isEdit ? __('Edit Post Type', 'native-custom-fields') : __('Create Post Type', 'native-custom-fields');
	const post_type_slug = urlParams.get('post_type_slug');

	const menu_slug = isEdit ? `native_custom_fields_post_type_builder_${post_type_slug}` : 'native_custom_fields_post_type_builder';
	const redirect_to = isEdit ? null : window.nativeCustomFieldsData.admin_url + '/admin.php?page=native-custom-fields-post-type-builder';

	const handleBackToList = () => {
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.delete('step');
		currentUrl.searchParams.delete('post_type_slug');
		currentUrl.searchParams.delete('edit');
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
				_builderType='postType'
				_sections={postTypesConfigurations}
				_layout='tab_panel'
				_resetForm={false}
				_redirectTo={redirect_to}
			/>
		</>

	);
}

export default EditOrSavePostType;
