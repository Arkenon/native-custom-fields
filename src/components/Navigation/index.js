/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import NavigationMenu from './NavigationMenu';
import NavigationItem from './NavigationItem';
import NavigationGroup from './NavigationGroup';

/**
 * Custom Navigation component
 * 
 * @param {Object} props Component properties
 * @param {string} props.activeItem Active item identifier
 * @param {string} props.className Additional CSS class
 * @param {Function} props.onActivateMenu Menu activation handler
 * @param {React.ReactNode} props.children Navigation content
 * @returns {React.ReactElement} Navigation component
 */
const Navigation = ({ 
    activeItem, 
    className = '', 
    onActivateMenu = () => {}, 
    children 
}) => {
    return (
        <div className={`native-custom-fields-navigation ${className}`.trim()}>
            {children}
        </div>
    );
};

Navigation.Menu = NavigationMenu;
Navigation.Item = NavigationItem;
Navigation.Group = NavigationGroup;

export default Navigation; 