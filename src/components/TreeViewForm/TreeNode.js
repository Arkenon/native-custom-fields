import { useState } from '@wordpress/element';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button, Icon } from '@wordpress/components';
import { chevronRight, chevronDown, dragHandle, trash, plus, copy } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

// Children Drop Zone Component - drop target for Group/Repeater
const ChildrenDropZone = ({ parentId, parentNode, children, nodes, level, selectedNodeId, onSelectNode, onDeleteNode, onAddFieldToContainer, onDuplicateField, onMoveFieldUp, onMoveFieldDown, animatingNodes, rootIds }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `${parentId}-children-dropzone`,
        data: {
            type: 'children-container',
            parentId: parentId,
        }
    });

    const hasChildren = children && children.length > 0;
    const isContainer = parentNode && (
        parentNode.fieldType === 'section' ||
        parentNode.fieldType === 'meta_box' ||
        parentNode.fieldType === 'group' ||
        parentNode.fieldType === 'repeater'
    );

    return (
        <div
            ref={setNodeRef}
            className={`gf-tree-node__children ${isOver ? 'gf-tree-node__children--drag-over' : ''}`}
        >
            {hasChildren && (
                <SortableContext items={children} strategy={verticalListSortingStrategy}>
                    {children.map(childId => {
                        const childNode = nodes[childId];
                        if (!childNode) return null;

                        return (
                            <TreeNode
                                key={childId}
                                nodeId={childId}
                                node={childNode}
                                nodes={nodes}
                                level={level + 1}
                                selectedNodeId={selectedNodeId}
                                onSelectNode={onSelectNode}
                                onDeleteNode={onDeleteNode}
                                onAddFieldToContainer={onAddFieldToContainer}
                                onDuplicateField={onDuplicateField}
                                onMoveFieldUp={onMoveFieldUp}
                                onMoveFieldDown={onMoveFieldDown}
                                animatingNodes={animatingNodes}
                                rootIds={rootIds}
                            />
                        );
                    })}
                </SortableContext>
            )}

            {/* Add Field button for containers (Section/Meta Box/Group/Repeater) */}
            {isContainer && (
                <div
                    className={`gf-tree-node__add-field-container ${
                        parentNode.fieldType === 'section' || parentNode.fieldType === 'meta_box'
                            ? 'gf-tree-node__add-field-container--primary'
                            : 'gf-tree-node__add-field-container--secondary'
                    }`}
                    style={{ marginLeft: `${(level + 1) * 24}px` }}
                >
                    <Button
                        variant="tertiary"
                        icon={plus}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddFieldToContainer && onAddFieldToContainer(parentId);
                        }}
                        className="gf-tree-node__add-field-button"
                        size="small"
                        label={__('Add Field', 'native-custom-fields')}
                        showTooltip={true}
                    />
                </div>
            )}

            {/* Drop indicator - only visible while drag over */}
            {isOver && (
                <div
                    className="gf-tree-node__children-drop-indicator"
                    style={{ marginLeft: `${(level + 1) * 24}px` }}
                >
                    <div className="gf-tree-node__children-drop-line"></div>
                </div>
            )}
        </div>
    );
};

const TreeNode = ({ nodeId, node, nodes, level, selectedNodeId, onSelectNode, onDeleteNode, onAddFieldToContainer, onDuplicateField, onMoveFieldUp, onMoveFieldDown, animatingNodes, rootIds }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Guard against undefined node
    if (!node) {
        console.warn('TreeNode: node is undefined for nodeId:', nodeId);
        return null;
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({ id: nodeId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0;
    const canHaveChildren = node.fieldType === 'group' || node.fieldType === 'repeater' || node.fieldType === 'section' || node.fieldType === 'meta_box';
    const isSelected = selectedNodeId === nodeId;

    // Calculate sibling index for move operations
    const siblingsArray = node.parentId ? nodes[node.parentId]?.children : rootIds;
    const siblingIndex = siblingsArray ? siblingsArray.indexOf(nodeId) : -1;
    const isFirstSibling = siblingIndex === 0;
    const isLastSibling = siblingIndex === siblingsArray?.length - 1;
    const isAnimating = animatingNodes && animatingNodes[nodeId];

    // Tree indentation
    const indent = level * 12; // 12px per level

    return (
        <>
            {/* Drop indicator - above */}
            {isOver && (
                <div className="gf-tree-node__drop-indicator gf-tree-node__drop-indicator--before">
                    <div className="gf-tree-node__drop-indicator-line"></div>
                </div>
            )}

            <div
                ref={setNodeRef}
                style={style}
                className={`gf-tree-node ${isSelected ? 'gf-tree-node--selected' : ''} ${isOver ? 'gf-tree-node--drag-over' : ''} gf-tree-node--level-${level} ${node.fieldType === 'section' ? 'gf-tree-node--section' : ''} ${node.fieldType === 'meta_box' ? 'gf-tree-node--meta-box' : ''} ${isAnimating || ''}`}
                onClick={() => onSelectNode(nodeId)}
            >
                {/* Tree indent with visual guides */}
                {level > 0 && (
                    <div className="gf-tree-node__indent" style={{ width: `${indent}px` }}>
                        <div className="gf-tree-node__tree-line"></div>
                    </div>
                )}

                <div className="gf-tree-node__drag-handle" {...attributes} {...listeners}>
                    <Icon icon={dragHandle} />
                </div>

                {canHaveChildren ? (
                    <button
                        className="gf-tree-node__expand-button"
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    >
                        <Icon icon={isExpanded ? chevronDown : chevronRight} />
                    </button>
                ) : (
                    <div className="gf-tree-node__spacer"></div>
                )}

                <div className="gf-tree-node__content">
                    <span className="gf-tree-node__type">{node.fieldType || 'unknown'}</span>
                    {node.fieldLabel && <span className="gf-tree-node__label"> - {node.fieldLabel}</span>}
                    {node.name && <span className="gf-tree-node__name"> ({node.name})</span>}
                </div>

                <div className="gf-tree-node__actions">
                    {/* Move Up Button */}
                    <Button
                        className="gf-tree-node__move-up"
                        icon="arrow-up-alt2"
                        isSmall
                        variant="tertiary"
                        disabled={isFirstSibling || isAnimating}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveFieldUp && onMoveFieldUp(nodeId);
                        }}
                        label={__('Move Up', 'native-custom-fields')}
                        showTooltip={true}
                    />

                    {/* Move Down Button */}
                    <Button
                        className="gf-tree-node__move-down"
                        icon="arrow-down-alt2"
                        isSmall
                        variant="tertiary"
                        disabled={isLastSibling || isAnimating}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveFieldDown && onMoveFieldDown(nodeId);
                        }}
                        label={__('Move Down', 'native-custom-fields')}
                        showTooltip={true}
                    />

                    {/* Duplicate Button */}
                    <Button
                        className="gf-tree-node__duplicate"
                        icon={copy}
                        isSmall
                        variant="tertiary"
                        disabled={isAnimating}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateField && onDuplicateField(nodeId);
                        }}
                        label={__('Duplicate Field', 'native-custom-fields')}
                        showTooltip={true}
                    />

                    {/* Delete Button */}
                    <Button
                        className="gf-tree-node__delete"
                        icon={trash}
                        isDestructive
                        isSmall
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(__('Delete this field?', 'native-custom-fields'))) {
                                onDeleteNode(nodeId);
                            }
                        }}
                        label={__('Delete', 'native-custom-fields')}
                        showTooltip={true}
                    />
                </div>
            </div>

            {canHaveChildren && isExpanded && (
                <ChildrenDropZone
                    parentId={nodeId}
                    parentNode={node}
                    children={node.children || []}
                    nodes={nodes}
                    level={level}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={onSelectNode}
                    onDeleteNode={onDeleteNode}
                    onAddFieldToContainer={onAddFieldToContainer}
                    onDuplicateField={onDuplicateField}
                    onMoveFieldUp={onMoveFieldUp}
                    onMoveFieldDown={onMoveFieldDown}
                    animatingNodes={animatingNodes}
                    rootIds={rootIds}
                />
            )}
        </>
    );
};

export default TreeNode;
