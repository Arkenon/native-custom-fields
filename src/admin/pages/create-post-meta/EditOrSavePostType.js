import {__, sprintf} from "@wordpress/i18n";
import {useRef} from "@wordpress/element";
import {postTypesConfigurations} from "@nativecustomfields/configurations/post-meta/post-types-configurations.js";
import {Button, Flex, FlexItem} from "@wordpress/components";
import {chevronLeft} from "@wordpress/icons";
import {DataForm} from "@nativecustomfields/components";

const EditOrSavePostType = () => {

	// Tracks which label values were set by auto-fill so we can update them on next keystroke
	// without overwriting values the user manually typed.
	const prevAutoFilledRef = useRef({});

	const handleLabelAutoFill = (fieldName, value, currentValues) => {
		if (fieldName !== 'label' && fieldName !== 'singular_name') return null;

		const general  = currentValues['native_custom_fields_create_post_type_general'] ?? {};
		const plural   = fieldName === 'label'        ? value : (general.label ?? '');
		const singular = fieldName === 'singular_name' ? value : (general.singular_name ?? '');

		if (!plural || !singular) return null;

		const plL = plural.toLowerCase();
		const sgL = singular.toLowerCase();

		const defaults = {
			add_new:                  __('Add New', 'native-custom-fields'),
			menu_name:                singular,
			name_admin_bar:           singular,
			/* translators: %s: singular post type name */
			add_new_item:             sprintf(__('Add New %s', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			edit_item:                sprintf(__('Edit %s', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			new_item:                 sprintf(__('New %s', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			view_item:                sprintf(__('View %s', 'native-custom-fields'), singular),
			/* translators: %s: plural post type name */
			view_items:               sprintf(__('View %s', 'native-custom-fields'), plural),
			/* translators: %s: plural post type name */
			all_items:                sprintf(__('All %s', 'native-custom-fields'), plural),
			/* translators: %s: plural post type name */
			search_items:             sprintf(__('Search %s', 'native-custom-fields'), plural),
			/* translators: %s: singular post type name */
			parent_item_colon:        sprintf(__('Parent %s:', 'native-custom-fields'), singular),
			/* translators: %s: plural post type name (lowercase) */
			not_found:                sprintf(__('No %s found', 'native-custom-fields'), plL),
			/* translators: %s: plural post type name (lowercase) */
			not_found_in_trash:       sprintf(__('No %s found in Trash', 'native-custom-fields'), plL),
			/* translators: %s: singular post type name */
			archives:                 sprintf(__('%s Archives', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			attributes:               sprintf(__('%s Attributes', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name (lowercase) */
			insert_into_item:         sprintf(__('Insert into %s', 'native-custom-fields'), sgL),
			/* translators: %s: singular post type name (lowercase) */
			uploaded_to_this_item:    sprintf(__('Uploaded to this %s', 'native-custom-fields'), sgL),
			featured_image:           __('Featured Image', 'native-custom-fields'),
			set_featured_image:       __('Set featured image', 'native-custom-fields'),
			remove_featured_image:    __('Remove featured image', 'native-custom-fields'),
			use_featured_image:       __('Use as featured image', 'native-custom-fields'),
			/* translators: %s: plural post type name (lowercase) */
			filter_items_list:        sprintf(__('Filter %s list', 'native-custom-fields'), plL),
			/* translators: %s: plural post type name */
			items_list_navigation:    sprintf(__('%s list navigation', 'native-custom-fields'), plural),
			/* translators: %s: plural post type name */
			items_list:               sprintf(__('%s list', 'native-custom-fields'), plural),
			/* translators: %s: singular post type name */
			item_published:           sprintf(__('%s published', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			item_published_privately: sprintf(__('%s published privately', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			item_reverted_to_draft:   sprintf(__('%s reverted to draft', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			item_scheduled:           sprintf(__('%s scheduled', 'native-custom-fields'), singular),
			/* translators: %s: singular post type name */
			item_updated:             sprintf(__('%s updated', 'native-custom-fields'), singular),
		};

		const currentLabels = currentValues['native_custom_fields_create_post_type_labels'] ?? {};
		const prevAutoFilled = prevAutoFilledRef.current;

		const updates = {};
		for (const [key, autoVal] of Object.entries(defaults)) {
			const currentVal = currentLabels[key];
			// Update the field if: it is empty, OR its current value still matches
			// what auto-fill previously wrote (meaning the user hasn't customised it).
			if (!currentVal || currentVal === prevAutoFilled[key]) {
				updates[key] = autoVal;
			}
		}

		// Remember what was auto-filled so the next keystroke can detect it.
		prevAutoFilledRef.current = { ...prevAutoFilled, ...updates };

		return Object.keys(updates).length
			? { native_custom_fields_create_post_type_labels: updates }
			: null;
	};

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
				_onFieldChange={handleLabelAutoFill}
			/>
		</>

	);
}

export default EditOrSavePostType;
