/**
 * Navigation Group component
 * 
 * @param {Object} props Component properties
 * @param {React.ReactNode} props.children Group content
 * @param {string} props.title Optional group title
 * @returns {React.ReactElement} Navigation group
 */
const NavigationGroup = ({ children, title }) => {
    return (
        <div className="native-custom-fields-navigation-group">
            {title && <h3 className="native-custom-fields-navigation-group__title">{title}</h3>}
            <div className="native-custom-fields-navigation-group__content">
                {children}
            </div>
        </div>
    );
};

export default NavigationGroup; 