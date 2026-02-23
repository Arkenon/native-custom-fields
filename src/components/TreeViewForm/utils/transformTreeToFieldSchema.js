/**
 * Transform internal tree state to field schema format expected by backend
 *
 * Rules:
 * - Root nodes become array items
 * - Nodes with children (group/repeater) get a "fields" property
 * - Other nodes don't have "fields" property
 * - Remove UI-specific properties (id, parentId, isExpanded, etc.)
 * - Filter out empty objects for field_base_info, field_custom_info_*, and field_dependency_info
 */
export function transformTreeToFieldSchema(nodes, rootIds) {
    /**
     * Helper function to check if an object is empty or only contains empty values
     */
    const isEmptyObject = (obj) => {
        if (!obj || typeof obj !== 'object') return true;
        if (Array.isArray(obj)) return obj.length === 0;
        return Object.keys(obj).length === 0;
    };

    const transformNode = (nodeId) => {
        const node = nodes[nodeId];
        if (!node) return null;

        // Start with empty config
        const fieldConfig = {};

        // Get the field type to determine which custom info to include
        const fieldType = node.fieldType;
        const expectedCustomInfoKey = `field_custom_info_${fieldType}`;

        // Copy all properties except UI-specific ones
        const uiProps = ['id', 'parentId', 'children', 'isExpanded'];
        Object.keys(node).forEach(key => {
            if (!uiProps.includes(key)) {
                // Special handling for field_base_info, field_custom_info_*, and field_dependency_info
                if (key === 'field_base_info' || key === 'field_dependency_info') {
                    // Only include them if they're not empty objects
                    if (!isEmptyObject(node[key])) {
                        fieldConfig[key] = node[key];
                    }
                } else if (key.startsWith('field_custom_info_')) {
                    // Only include the field_custom_info that matches the field type
                    if (key === expectedCustomInfoKey && !isEmptyObject(node[key])) {
                        fieldConfig[key] = node[key];
                    }
                    // Skip other field_custom_info_* properties that don't match this field type
                } else {
                    fieldConfig[key] = node[key];
                }
            }
        });

        // Add fields array if node has children (group, repeater, section, or meta_box)
        if (node.children && node.children.length > 0) {
            fieldConfig.fields = node.children
                .map(childId => transformNode(childId))
                .filter(Boolean);
        }

        return fieldConfig;
    };

    // Transform root nodes to array
    return rootIds
        .map(nodeId => transformNode(nodeId))
        .filter(Boolean);
}
