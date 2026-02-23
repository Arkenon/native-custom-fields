import {__} from "@wordpress/i18n";
import {Button, Flex, FlexItem} from "@wordpress/components";
import {chevronLeft} from "@wordpress/icons";
import {taxonomyConfigurations} from "@nativecustomfields/configurations/term-meta/taxonomy-configurations.js";
import {DataForm} from "@nativecustomfields/components";

const EditOrSaveTaxonomy = () => {

    const urlParams = new URLSearchParams(window.location.search);
    const isEdit = urlParams.get('edit');
    const pageTitle = isEdit ? __('Edit Taxonomy', 'native-custom-fields') : __('Create Custom Taxonomy', 'native-custom-fields');
    const taxonomy_slug = urlParams.get('taxonomy_slug');

    const menu_slug = isEdit ? `native_custom_fields_taxonomy_builder_${taxonomy_slug}` : 'native_custom_fields_taxonomy_builder';
	const redirect_to = isEdit ? null : window.nativeCustomFieldsData.admin_url + '/admin.php?page=native-custom-fields-taxonomy-builder';

    const handleBackToList = () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('step');
        currentUrl.searchParams.delete('taxonomy_slug');
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
				_builderType='customTaxonomy'
				_sections={taxonomyConfigurations}
                _layout='tab_panel'
                _resetForm={false}
				_redirectTo={redirect_to}
            />
        </>

    );
}

export default EditOrSaveTaxonomy;
