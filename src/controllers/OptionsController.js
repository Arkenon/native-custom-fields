import {fieldInitializationError} from "@nativecustomfields/common/helper.js";
import {createRoot} from "@wordpress/element";
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