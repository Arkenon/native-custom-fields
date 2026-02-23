/**
 * WordPress dependencies
 */
import { Panel as WPPanel, PanelBody, PanelRow, PanelHeader } from '@wordpress/components';
import { Icon } from '@wordpress/components';
import { Flex, FlexItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import RenderFields from '../../render/RenderFields';

/**
 * Panel component
 *
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {string} [props.header] Panel header text
 * @param {string} [props.className] CSS class for the wrapper element
 * @param {string} [props.title] Panel title
 * @param {string|JSX.Element} [props.icon] Icon element or icon name
 * @param {boolean} [props.initialOpen] Whether panel should be initially opened
 * @param {boolean} [props.opened] Force panel to stay open
 * @param {boolean} [props.scrollAfterOpen] Whether to scroll after opening
 * @param {Array} [props.fields] Fields to render inside panel
 * @param {React.ReactNode} [props.children] Panel content
 * @param {Function} [props.onToggle] Callback when panel is toggled
 * @param {Object} [props.buttonProps] Props passed to the Button component in title
 * @param {boolean} [props.disabled] Whether the panel is disabled
 * @param {string} [props.help] Help text to display below the title
 * @returns {React.ReactElement} Panel component
 */
const Panel = ({
    header,
    className,
    title,
    icon,
    initialOpen = true,
    opened,
    scrollAfterOpen = true,
    fields,
    children,
    onToggle,
    buttonProps = {},
    disabled = false,
    help
}) => {
    return (
        <WPPanel className={`native-custom-fields-custom-panel${className || ''}`}>
            {header && (
                <PanelHeader>
                    {typeof header === 'string' ? <h2>{header}</h2> : header}
                </PanelHeader>
            )}
            <PanelBody
                title={title}
                icon={typeof icon === 'string' ? <Icon icon={icon} /> : icon}
                initialOpen={initialOpen}
                opened={opened}
                scrollAfterOpen={scrollAfterOpen}
                onToggle={onToggle}
                buttonProps={buttonProps}
                disabled={disabled}
                help={help}
            >
                {fields ? <RenderFields fields={fields} /> : children}
            </PanelBody>
        </WPPanel>
    );
};

/**
 * Panel Body component
 *
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {string} [props.title] Body title
 * @param {boolean} [props.opened] Force panel to stay open
 * @param {string} [props.className] CSS class for the wrapper element
 * @param {string|JSX.Element} [props.icon] Icon element or icon name
 * @param {Function} [props.onToggle] Callback when panel is toggled
 * @param {boolean} [props.initialOpen=true] Whether panel should be initially opened
 * @param {Object} [props.buttonProps={}] Props passed to the Button component in title
 * @param {boolean} [props.scrollAfterOpen=true] Whether to scroll content into view when opened
 * @param {Array} [props.fields] Fields to render inside panel body
 * @param {React.ReactNode} [props.children] Panel content
 * @returns {React.ReactElement} Panel Body component
 */
const Body = ({
    title,
    opened,
    className,
    icon,
    onToggle,
    initialOpen = true,
    buttonProps = {},
    scrollAfterOpen = true,
    fields,
    children
}) => {
    return (
        <PanelBody
            title={title}
            opened={opened}
            className={`native-custom-fields-panel-body ${className || ''}`}
            icon={typeof icon === 'string' ? <Icon icon={icon} /> : icon}
            onToggle={onToggle}
            initialOpen={initialOpen}
            buttonProps={buttonProps}
            scrollAfterOpen={scrollAfterOpen}
        >
            {fields ? <RenderFields fields={fields} /> : children}
        </PanelBody>
    );
};

/**
 * Panel Row component
 *
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {string} [props.className] CSS class for the wrapper element
 * @param {Array} [props.fields] Fields to render inside row
 * @param {React.ReactNode} [props.children] Row content
 * @param {string} [props.justify='space-between'] Justification of children (flex-start, flex-end, center, space-between, space-around)
 * @param {string} [props.align='center'] Alignment of children (flex-start, flex-end, center, stretch, baseline)
 * @param {number} [props.gap=2] Gap between children
 * @returns {React.ReactElement} Panel Row component
 */
const Row = ({
    className,
    fields,
    children,
    justify = 'space-between',
    align = 'top',
    gap = 2
}) => {
    const renderContent = () => {
        if (fields) {
            return fields.map((field, index) => (
                <FlexItem className='components-flex-item-custom-width' key={`flex-item-${index}`}>
                    <RenderFields fields={[field]} />
                </FlexItem>
            ));
        }
        if (Array.isArray(children)) {
            return children.map((child, index) => (
                <FlexItem className='components-flex-item-custom-width' key={`flex-item-${index}`}>
                    {child}
                </FlexItem>
            ));
        }
        return <FlexItem className='components-flex-item-custom-width'>{children}</FlexItem>;
    };

    return (
        <PanelRow className={`native-custom-fields-panel-row ${className || ''}`}>
            <Flex
                direction={[
                    'column',
                    'row'
                ]}
                justify={justify}
                align={align}
                gap={gap}
            >
                {renderContent()}
            </Flex>
        </PanelRow>
    );
};

// Add static components
Panel.Body = Body;
Panel.Row = Row;
Panel.Header = PanelHeader;

export default Panel;
