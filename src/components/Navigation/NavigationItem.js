/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Navigation Item component
 *
 * @param {Object} props Component properties
 * @param {string} props.item Item identifier
 * @param {Function} props.onClick Click handler
 * @param {string} props.title Item title
 * @param {React.ReactNode} props.icon Item icon
 * @param {boolean} props.isActive Whether the item is active
 * @returns {React.ReactElement} Navigation item
 */
const NavigationItem = ({
    item,
    onClick,
    title,
    icon,
    isActive = false
}) => {
    return (
		<Button
			key={item}
			className={`native-custom-fields-navigation-item ${isActive ? 'is-active' : ''}`}
			onClick={onClick}
		>
			{icon && <span className="native-custom-fields-navigation-item__icon">{icon}</span>}
			<span className="native-custom-fields-navigation-item__title">{title}</span>
		</Button>
	);
};

export default NavigationItem;
