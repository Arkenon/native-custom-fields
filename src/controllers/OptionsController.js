import {fieldInitializationError} from "@nativecustomfields/common/helper.js";
import {createRoot} from "@wordpress/element";
import EditOrSaveOptionsPageFields from "@nativecustomfields/admin/pages/create-options/EditOrSaveOptionsPageFields.js";
import EditOrSaveOptionsPage from "@nativecustomfields/admin/pages/create-options/EditOrSaveOptionsPage.js";
import OptionsPageListTable from "@nativecustomfields/admin/pages/create-options/OptionsPageListTable.js";
import {DataForm} from "@nativecustomfields/components";

/**
 * Renders options fields on the page.
 * Wrapper is provided by PHP service.
 * Menu slug and page title are passed via data attributes. RenderDataForm component handles the rest.
 * @returns {void}
 * @since 1.0.0
 */
export const renderOptionsFields = () => {
	// Initialize options pages
	const optionsWrappers = document.querySelectorAll('.native-custom-fields-wrapper');
	optionsWrappers.forEach(wrapper => {
		try {
			const menuSlug = wrapper.dataset.menu;
			const pageTitle = wrapper.dataset.pageTitle;

			if (!menuSlug) {
				console.error(__('Menu slug not found', 'native-custom-fields'));
			}

			const root = createRoot(wrapper);
			root.render(
				<DataForm
					_menuSlug={menuSlug}
					_pageTitle={pageTitle}
				/>
			);
		} catch (error) {
			fieldInitializationError(error);
		}
	});
};


/**
 * Renders the options page creation and editing interface.
 * The interface allows users to create new options pages, edit existing ones,
 * and manage the fields associated with those pages.
 * The rendering is based on the current step in the process, determined by URL parameters.
 * @returns {void}
 * @since 1.0.0
 */
export const renderCreateOptionsPages = () => {
	const optionsPageBuilderWrapper = document.querySelector('.native-custom-fields-options-page-builder-wrapper');

	// Get URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const step = urlParams.get('step');

	if (optionsPageBuilderWrapper) {
		const root = createRoot(optionsPageBuilderWrapper);
		root.render(
			<>
				{
					step === 'edit-or-save-fields' ? <EditOrSaveOptionsPageFields/> :
						step === 'edit-or-save-menu-page' ? <EditOrSaveOptionsPage/> :
								<div className="native-custom-fields-app">
									<OptionsPageListTable/>
								</div>
				}
			</>
		);
	}
}
