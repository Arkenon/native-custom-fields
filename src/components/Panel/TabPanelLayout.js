/**
 * WordPress dependencies
 */
import {Icon, Flex, Button} from '@wordpress/components';
import {useState, useEffect} from '@wordpress/element';

/**
 * Internal dependencies
 */
import {Header, Panel, TabPanel} from '..';
import RenderFields from '../../render/RenderFields';

/**
 * Render tab panel layout
 *
 * @param {Object} props Component properties
 * @param {Array} props.sections Sections configuration
 * @param {Object} props.values Field values
 * @param {string} props.pageTitle Page title
 * @param {Function} props.onChange Value change handler
 * @returns {React.ReactElement} Tab panel layout
 */
const TabPanelLayout = (
    {
        sections,
        values,
        pageTitle,
        onChange,
        onSectionChange,
        showHeader = true
    }
) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const [activeTab, setActiveTab] = useState(sections[0]?.section_name);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 960);
        };

        if (typeof onSectionChange === 'function' && activeTab) {
            onSectionChange(activeTab);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab, onSectionChange]);

    // Validate fields structure
    useEffect(() => {
        sections.forEach((section, index) => {
            if (!section.section_name) {
                console.warn(`Tab at index ${index} is missing 'section_name' property`);
            }
        });
    }, [sections]);

    const tabs = sections.map(section => ({
        name: section.section_name,
        title: (
            <Flex gap={2} align="center">
				{section.section_icon && <Icon icon={section.section_icon}/>}
                <span>{section.section_title}</span>
            </Flex>
        )
    }));

    return (
        <>
            {showHeader && (<Header title={pageTitle}/>)}
            <TabPanel
                className={`native-custom-fields-tabs ${isMobile ? 'is-mobile' : ''}`}
                tabs={tabs}
                onSelect={(tab) => {
                    setActiveTab(tab);
                    if (typeof onSectionChange === 'function') {
                        onSectionChange(tab);
                    }

                }}
                initialTabName={activeTab}
            >
                {(tab) => {
                    const tabData = sections.find(f => f.section_name === tab.name);
                    if (!tabData) return null;
                    return (
                        <div className="native-custom-fields-tab-content">
                            <RenderFields
                                fields={tabData.fields}
                                values={values[tabData.section_name]}
                                onChange={onChange}
                            />
                        </div>
                    );
                }}
            </TabPanel>
        </>
    );
};

export default TabPanelLayout;
