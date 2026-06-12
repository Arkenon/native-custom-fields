import {__, sprintf} from "@wordpress/i18n";
import {useRef} from "@wordpress/element";
import {Button, Flex, FlexItem} from "@wordpress/components";
import {chevronLeft} from "@wordpress/icons";
import {taxonomyConfigurations} from "@nativecustomfields/configurations/term-meta/taxonomy-configurations.js";
import {DataForm} from "@nativecustomfields/components";

const EditOrSaveTaxonomy = () => {

	const prevAutoFilledRef = useRef({});

	const handleLabelAutoFill = (fieldName, value, currentValues) => {
		if (fieldName !== 'label' && fieldName !== 'singular_name') return null;

		const general  = currentValues['native_custom_fields_create_taxonomy_general'] ?? {};
		const plural   = fieldName === 'label'        ? value : (general.label ?? '');
		const singular = fieldName === 'singular_name' ? value : (general.singular_name ?? '');

		if (!plural || !singular) return null;

		const plL = plural.toLowerCase();
		const sgL = singular.toLowerCase();

		const defaults = {
			menu_name:                    plural,
			name_admin_bar:               singular,
			/* translators: %s: singular taxonomy name */
			add_new_item:                 sprintf(__('Add New %s', 'native-custom-fields'), singular),
			/* translators: %s: singular taxonomy name */
			new_item_name:                sprintf(__('New %s Name', 'native-custom-fields'), singular),
			/* translators: %s: singular taxonomy name */
			template_name:                sprintf(__('%s Template Name', 'native-custom-fields'), singular),
			/* translators: %s: plural taxonomy name (lowercase) */
			separate_items_with_commas:   sprintf(__('Separate %s with commas', 'native-custom-fields'), plL),
			/* translators: %s: plural taxonomy name (lowercase) */
			add_or_remove_items:          sprintf(__('Add or remove %s', 'native-custom-fields'), plL),
			most_used:                    __('Most Used', 'native-custom-fields'),
			/* translators: %s: plural taxonomy name (lowercase) */
			choose_from_most_used:        sprintf(__('Choose from the most used %s', 'native-custom-fields'), plL),
			/* translators: %s: plural taxonomy name */
			back_to_items:                sprintf(__('← Back to %s', 'native-custom-fields'), plural),
			/* translators: %s: singular taxonomy name */
			item_link:                    sprintf(__('%s Link', 'native-custom-fields'), singular),
			/* translators: %s: singular taxonomy name (lowercase) */
			item_link_description:        sprintf(__('A link to a %s', 'native-custom-fields'), sgL),
			/* translators: %s: plural taxonomy name */
			all_items:                    sprintf(__('All %s', 'native-custom-fields'), plural),
			/* translators: %s: singular taxonomy name */
			view_item:                    sprintf(__('View %s', 'native-custom-fields'), singular),
			/* translators: %s: singular taxonomy name */
			update_item:                  sprintf(__('Update %s', 'native-custom-fields'), singular),
			/* translators: %s: plural taxonomy name */
			search_items:                 sprintf(__('Search %s', 'native-custom-fields'), plural),
			/* translators: %s: plural taxonomy name */
			popular_items:                sprintf(__('Popular %s', 'native-custom-fields'), plural),
			/* translators: %s: singular taxonomy name */
			parent_item:                  sprintf(__('Parent %s', 'native-custom-fields'), singular),
			/* translators: %s: singular taxonomy name */
			parent_item_colon:            sprintf(__('Parent %s:', 'native-custom-fields'), singular),
			/* translators: %s: plural taxonomy name (lowercase) */
			not_found:                    sprintf(__('No %s found', 'native-custom-fields'), plL),
			/* translators: %s: plural taxonomy name (lowercase) */
			no_terms:                     sprintf(__('No %s', 'native-custom-fields'), plL),
			/* translators: %s: singular taxonomy name (lowercase) */
			filter_by_item:               sprintf(__('Filter by %s', 'native-custom-fields'), sgL),
			/* translators: %s: plural taxonomy name */
			items_list_navigation:        sprintf(__('%s list navigation', 'native-custom-fields'), plural),
			/* translators: %s: plural taxonomy name */
			items_list:                   sprintf(__('%s list', 'native-custom-fields'), plural),
		};

		const currentLabels = currentValues['native_custom_fields_create_taxonomy_labels'] ?? {};
		const prevAutoFilled = prevAutoFilledRef.current;

		const updates = {};
		for (const [key, autoVal] of Object.entries(defaults)) {
			const currentVal = currentLabels[key];
			if (!currentVal || currentVal === prevAutoFilled[key]) {
				updates[key] = autoVal;
			}
		}

		prevAutoFilledRef.current = { ...prevAutoFilled, ...updates };

		return Object.keys(updates).length
			? { native_custom_fields_create_taxonomy_labels: updates }
			: null;
	};

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
				_onFieldChange={handleLabelAutoFill}
            />
        </>

    );
}

export default EditOrSaveTaxonomy;
