import {useState} from '@wordpress/element';
import {Button, Modal, SearchControl, Icon} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {plus} from '@wordpress/icons';
import {withIcons} from '@nativecustomfields/common/helper';

const { field_types = [], container_types = [] } = window.nativeCustomFieldsData ?? {};

const FIELD_TYPES     = withIcons( field_types );
const CONTAINER_TYPES = withIcons( container_types );

// Field Grid Component - can be used inside or outside modal
export const FieldPaletteGrid = ({onAddField, mode = 'field', isPostType = false}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const typesToShow = mode === 'container' ? CONTAINER_TYPES : FIELD_TYPES;

    const filteredByMode = mode === 'container'
        ? typesToShow.filter(type => isPostType ? type.value === 'meta_box' : type.value === 'section')
        : typesToShow;

    const filteredTypes = searchTerm.trim()
        ? filteredByMode.filter(type =>
            type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            type.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : filteredByMode;

    return (
        <div className="gf-field-palette__container">
            {mode === 'field' && (
                <div className="gf-field-palette__search">
                    <SearchControl
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={__('Search fields...', 'native-custom-fields')}
                        className="gf-field-palette__search-input"
                    />
                </div>
            )}
            <div className="gf-field-palette__grid">
                {filteredTypes.length > 0 ? (
                    filteredTypes.map(fieldType => (
                        <Button
                            key={fieldType.value}
                            variant="secondary"
                            className="gf-field-palette__button"
                            onClick={() => onAddField(fieldType.value)}
                        >
                            {fieldType.icon && (
                                <Icon icon={fieldType.icon} className="gf-field-palette__icon"/>
                            )}
                            <span>{fieldType.label}</span>
                        </Button>
                    ))
                ) : (
                    <div className="gf-field-palette__no-results">
                        {__('No fields found', 'native-custom-fields')}
                    </div>
                )}
            </div>
        </div>
    );
};

const FieldPalette = ({onAddField, mode = 'field', isPostType = false, showAsModal = true}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddField = (fieldType) => {
        onAddField(fieldType);
        setIsOpen(false);
    };

    const buttonLabel = mode === 'container'
        ? (isPostType ? __('Add Meta Box', 'native-custom-fields') : __('Add Section', 'native-custom-fields'))
        : __('Add Field', 'native-custom-fields');

    const modalTitle = mode === 'container'
        ? (isPostType ? __('Add Meta Box', 'native-custom-fields') : __('Add Section', 'native-custom-fields'))
        : __('Add Field', 'native-custom-fields');

    // Container mode: Add directly without modal
    if (mode === 'container') {
        const containerType = isPostType ? 'meta_box' : 'section';
        return (
            <Button
                variant="primary"
                icon={plus}
                onClick={() => onAddField(containerType)}
                className="gf-field-palette__trigger"
            >
                {buttonLabel}
            </Button>
        );
    }

    // If not showing as modal, just return the grid
    if (!showAsModal) {
        return <FieldPaletteGrid onAddField={onAddField} mode={mode} isPostType={isPostType}/>;
    }

    // Field mode: Show modal with field options
    return (
        <>
            <Button
                variant="primary"
                icon={plus}
                onClick={() => setIsOpen(true)}
                className="gf-field-palette__trigger"
            >
                {buttonLabel}
            </Button>

            {isOpen && (
                <Modal
                    title={modalTitle}
                    onRequestClose={() => setIsOpen(false)}
                    className="gf-field-palette-modal"
                >
                    <FieldPaletteGrid onAddField={handleAddField} mode={mode} isPostType={isPostType}/>
                </Modal>
            )}
        </>
    );
};

export default FieldPalette;
