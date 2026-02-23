/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {
    Flex,
    FlexBlock,
    FlexItem,
    Icon,
    Button
} from '@wordpress/components';
import {useState, useEffect} from '@wordpress/element';

/**
 * Internal dependencies
 */
import Panel from '../Panel/Panel';
import Navigation from './index';
import HamburgerMenu from '../MobileMenu/HamburgerMenu';
import RenderFields from '../../render/RenderFields';
import {Header} from "@nativecustomfields/components/index.js";

/**
 * Render navigation layout
 *
 * @param {Object} props Component properties
 * @param {Array} props.sections Sections configuration
 * @param {Object} props.values Field values
 * @param {string} props.pageTitle Page title
 * @param {Function} props.onChange Value change handler
 * @returns {React.ReactElement} Navigation layout
 */
const NavigationLayout = (
    {
		sections,
        values,
        pageTitle,
        onChange,
        onSectionChange,
        hasHeader = true
    }
) => {
    const [activeSection, setActiveSection] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const [showNavigation, setShowNavigation] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 960;
            setIsMobile(mobile);
            if (!mobile) {
                setShowNavigation(false);
            }
        };

        if (typeof onSectionChange === 'function' && sections?.[activeSection]?.section_name) {
            onSectionChange(sections[activeSection].section_name);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeSection, sections, onSectionChange]);

    const headerContent = (
        <Flex justify="space-between" align="center">
            <FlexItem>
				<h2 className='native-custom-fields-app-header-title'>{pageTitle}</h2>
            </FlexItem>
            {isMobile && (
                <FlexItem>
                    <Button
                        icon="menu"
                        className="native-custom-fields-menu-toggle"
                        label={__('Toggle menu', 'native-custom-fields')}
                        onClick={() => setShowNavigation(!showNavigation)}
                    />
                </FlexItem>
            )}
        </Flex>
    );

    const navigationMenu = (
        <Navigation
            activeItem={`section-${activeSection}`}
            className="native-custom-fields-navigation"
            onActivateMenu={() => {
            }}
        >
            <Navigation.Menu>
                <Navigation.Group>
                    {sections.map((section, index) => (
                        <Navigation.Item
                            key={`section-${index}`}
                            item={`section-${index}`}
                            onClick={() => {
                                setActiveSection(index);
                                if (typeof onSectionChange === 'function') {
                                    onSectionChange(section.section_name);
                                }
                                if (isMobile) {
                                    setShowNavigation(false);
                                }
                            }}
                            title={section.section_title}
                            icon={<Icon icon={section.section_icon}/>}
                            isActive={activeSection === index}
                        />
                    ))}
                </Navigation.Group>
            </Navigation.Menu>
        </Navigation>
    );

    return (
        <>
            {hasHeader && (<Header children={headerContent}/>)}
			<>
				<Flex align="stretch" justify="flex-start" gap={0} style={{minHeight: '100%'}}>
					{!isMobile && (
						<FlexItem style={{
							width: '20%',
							borderRight: '1px solid #ddd',
							display: 'flex',
							flexDirection: 'column'
						}}>
							{navigationMenu}
						</FlexItem>
					)}

					<FlexBlock style={{
						paddingLeft: !isMobile ? '24px' : '0',
						display: 'flex',
						flexDirection: 'column'
					}}>
						{sections[activeSection] && (
							<div className="native-custom-fields-section">
								<RenderFields
									fields={sections[activeSection].fields}
									values={values[sections[activeSection].section_name]}
									onChange={onChange}
								/>
							</div>
						)}
					</FlexBlock>
				</Flex>


				{isMobile && (
					<HamburgerMenu
						isOpen={showNavigation}
						onClose={() => setShowNavigation(false)}
					>
						{navigationMenu}
					</HamburgerMenu>
				)}
			</>
        </>
    );
};

export default NavigationLayout;
