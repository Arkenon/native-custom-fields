import { Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import RenderFields from '@nativecustomfields/render/RenderFields';
import { fieldConfigurations } from '@nativecustomfields/configurations/field-configurations';

const FieldSettingsPanel = ({ nodeId, node, onUpdateNode }) => {
    if (!nodeId || !node) {
        return (
            <Panel className="gf-field-settings-panel">
                <PanelBody title={__('Field Settings', 'native-custom-fields')} initialOpen={true}>
                    <p className="gf-field-settings-panel__empty">
                        {__('Select a field to edit its settings', 'native-custom-fields')}
                    </p>
                </PanelBody>
            </Panel>
        );
    }

    // Remove UI-specific metadata
    const getCleanFieldData = (nodeData) => {
        const { id, parentId, children, ...cleanData } = nodeData;
        return cleanData;
    };

    // Handle field value changes from RenderFields
    const handleFieldChange = (fieldName, value) => {
        // Update the node with new value, keeping UI metadata
        onUpdateNode(nodeId, {
            ...node,
            [fieldName]: value
        });
    };

    const cleanFormData = getCleanFieldData(node);

    // Create dynamic title with field info
    const fieldLabel = node.fieldLabel || node.fieldType || __('Unnamed Field', 'native-custom-fields');
    const fieldName = node.name ? ` (${node.name})` : '';
    const panelTitle = `${fieldLabel}${fieldName}`;

    return (
        <Panel className="gf-field-settings-panel">
            <PanelBody title={panelTitle} initialOpen={true}>
                <div className="gf-field-settings-panel__content">
                    <RenderFields
                        fields={fieldConfigurations}
                        values={cleanFormData}
                        onChange={handleFieldChange}
                        nodeId={nodeId}
                    />
                </div>
            </PanelBody>
        </Panel>
    );
};

export default FieldSettingsPanel;
