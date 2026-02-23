import {useState} from '@wordpress/element';
import {Button, Icon} from '@wordpress/components';
import {chevronDown, chevronUp} from '@wordpress/icons';

const CustomPanel = (
    {
        title,
        children,
        icon,
        initialOpen = true,
        hasHeader = true,
        actions = null,
        draggable = false,
        onDragStart = null,
        onDragEnd = null,
        onDragOver = null,
        isOpen = undefined,
        onToggle = null
    }
) => {
    const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);

    // Use external isOpen if provided, otherwise use internal state
    const currentIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;

    const handleToggle = () => {
        if (onToggle) {
            onToggle(!currentIsOpen);
        } else {
            setInternalIsOpen(!internalIsOpen);
        }
    };

    return (
        <div className="native-custom-fields-custom-panel">
            {hasHeader && (
                <div
                    className="native-custom-fields-custom-panel-header"
                    onClick={handleToggle}
                    draggable={draggable}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <div className="native-custom-fields-custom-panel-title">
                        <Icon size={20} icon={icon}/>
                        <span>{title}</span>
                    </div>
                    <div className="native-custom-fields-custom-panel-header-actions">
                        {actions && (
                            <div
                                className="native-custom-fields-custom-panel-actions"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {actions}
                            </div>
                        )}
                        <Button
                            icon={currentIsOpen ? chevronUp : chevronDown}
                            className="native-custom-fields-custom-panel-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle();
                            }}
                        />
                    </div>
                </div>
            )}
            <div
                className="native-custom-fields-custom-panel-content"
                style={{display: currentIsOpen ? 'block' : 'none'}}
            >
                {children}
            </div>
        </div>
    );
};

export default CustomPanel;
