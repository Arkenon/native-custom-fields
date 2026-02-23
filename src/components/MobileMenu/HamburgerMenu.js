/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
    Button
} from '@wordpress/components';

/**
 * HamburgerMenu component
 * 
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {boolean} props.isOpen Whether the menu is open
 * @param {Function} props.onClose Callback when menu is closed
 * @param {React.ReactNode} props.children Menu content
 * @returns {React.ReactElement} HamburgerMenu component
 */
const HamburgerMenu = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className={`native-custom-fields-hamburger-menu ${isOpen ? 'is-open' : ''}`}
            role="dialog"
            aria-modal="true"
        >
            <div className="native-custom-fields-hamburger-menu-overlay" onClick={onClose} />
            <div className="native-custom-fields-hamburger-menu-content">
                <div className="native-custom-fields-hamburger-menu-header">
                    <Button
                        icon="no-alt"
                        label={__('Close menu', 'native-custom-fields')}
                        onClick={onClose}
                    />
                </div>
                <div className="native-custom-fields-hamburger-menu-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu; 