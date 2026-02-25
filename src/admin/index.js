/**
 * WordPress dependencies
 */
import {createRoot} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import './admin.scss';
import Dashboard from './pages/dashboard/Dashboard';
import {renderOptionsFields, renderCreateOptionsPages} from '@nativecustomfields/controllers/OptionsController.js';
import {renderPostMetaFields, renderCreatePostMeta} from '@nativecustomfields/controllers/PostMetaController.js';
import {renderCreateTermMeta, renderTermMetaFields} from "@nativecustomfields/controllers/TermMetaController.js";
import {renderCreateUserMeta, renderUserMetaFields} from "@nativecustomfields/controllers/UserMetaController.js";
import * as Components from '@nativecustomfields/components';
import {fieldConfigurations} from '@nativecustomfields/configurations/field-configurations.js';

// Set up REST API configuration
apiFetch.use(apiFetch.createNonceMiddleware(window.nativeCustomFieldsData.nonce));
apiFetch.use(apiFetch.createRootURLMiddleware(window.nativeCustomFieldsData.rest_url));

// Initialize admin pages
// Dashboard page
const dashboardPageWrapper = document.querySelector('.native-custom-fields-dashboard-container');
if (dashboardPageWrapper) {
	const root = createRoot(dashboardPageWrapper);
	root.render(
		<Dashboard/>
	);
}

// Initialize options fields
renderOptionsFields();

// Initialize post meta fields
renderPostMetaFields();
renderCreatePostMeta();

// Initialize term meta fields
renderTermMetaFields();
renderCreateTermMeta();

// Initialize user meta fields
renderUserMetaFields();
renderCreateUserMeta();


// Export components and configurations to global scope
window.NCF = {
	components: {
		...Components
	},
	configurations: {
		fieldConfigurations
	}
};
