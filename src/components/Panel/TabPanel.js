/**
 * WordPress dependencies
 */
import { TabPanel as WPTabPanel } from '@wordpress/components';
import { Icon } from '@wordpress/components';

/**
 * TabPanel component
 * 
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {string} [props.className] The class to give to the outer container
 * @param {string} [props.orientation='horizontal'] The orientation of the tablist
 * @param {Function} [props.onSelect] Function called when a tab is selected
 * @param {Array} props.tabs Array of tab objects
 * @param {string} [props.activeClass='is-active'] The class to add to the active tab
 * @param {string} [props.initialTabName] The name of the tab to be selected upon mounting
 * @param {boolean} [props.selectOnMove=true] Whether to select tab on focus
 * @param {Function} props.children Function that renders tab content
 * @returns {React.ReactElement} TabPanel component
 */
const TabPanel = ({ 
    className = '',
    orientation = 'horizontal',
    onSelect,
    tabs,
    activeClass = 'is-active',
    initialTabName,
    selectOnMove = true,
    children
}) => {
    if (!tabs || !Array.isArray(tabs)) {
        return null;
    }

    return (
        <WPTabPanel
            className={`native-custom-fields-tab-panel ${className}`}
            orientation={orientation}
            onSelect={onSelect}
            tabs={tabs.map(tab => ({
                name: tab.name,
                title: tab.title,
                className: `native-custom-fields-tab ${tab.className || ''}`,
                icon: tab.icon && <Icon icon={tab.icon} />,
                disabled: tab.disabled,
                ...tab
            }))}
            activeClass={activeClass}
            initialTabName={initialTabName}
            selectOnMove={selectOnMove}
        >
            {children}
        </WPTabPanel>
    );
};

export default TabPanel; 