/**
 * Navigation Menu component
 * 
 * @param {Object} props Component properties
 * @param {React.ReactNode} props.children Menu content
 * @returns {React.ReactElement} Navigation menu
 */
const NavigationMenu = ({ children }) => {
    return (
        <div className="native-custom-fields-navigation-menu">
            {children}
        </div>
    );
};

export default NavigationMenu; 