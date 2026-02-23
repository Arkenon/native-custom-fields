import {useCallback, useEffect, useRef, useState} from '@wordpress/element';
import {Modal, Notice, Panel, PanelBody} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import TreeNode from './TreeNode';
import FieldPalette, {FieldPaletteGrid} from './FieldPalette';
import FieldSettingsPanel from './FieldSettingsPanel';
import ActionButtons from '../ActionButtons/ActionButtons';
import {transformTreeToFieldSchema} from './utils/transformTreeToFieldSchema';
import {generateUniqueId} from './utils/generateUniqueId';
import {fieldConfigurations} from '@nativecustomfields/configurations/field-configurations';
import {deepClone} from '@nativecustomfields/common/helper.js';
import './TreeViewForm.scss';

const TreeViewForm = (
	{
		menuSlug,
		pageTitle,
		initialFields = [],
		onSave,
		isPostType = false,
		contextType = null, // 'options' | 'post_type' | 'taxonomy' | 'user'
		contextValue = null // menu_slug for options, post_type_slug for post_type, taxonomy_slug for taxonomy
	}
) => {
	// Internal tree state (flat structure for easier manipulation)
	const [nodes, setNodes] = useState(() => {
		if (!initialFields || initialFields.length === 0) return {};
		return initializeNodesFromFields(initialFields);
	});
	const [rootIds, setRootIds] = useState(() => {
		if (!initialFields || initialFields.length === 0) return [];
		const initialNodes = initializeNodesFromFields(initialFields);
		return extractRootIds(initialFields, initialNodes);
	});
	const [selectedNodeId, setSelectedNodeId] = useState(null);
	const [activeId, setActiveId] = useState(null);
	const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
	const [fieldModalTargetContainer, setFieldModalTargetContainer] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [saveMessage, setSaveMessage] = useState(null);

	// Animation state for move operations
	const [animatingNodes, setAnimatingNodes] = useState({});
	const animationTimeoutRef = useRef(null);
	const isMounted = useRef(true);

	// Check isPostType from URL if not provided as prop
	const [isPostTypeFromUrl, setIsPostTypeFromUrl] = useState(false);

	// Set mount/unmount status for animation cleanup
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const isPostTypeParam = urlParams.get('isPostType') === 'true';
		setIsPostTypeFromUrl(isPostTypeParam);
	}, []);

	// Update nodes and rootIds when initialFields changes (e.g., after async load)
	useEffect(() => {
		if (initialFields && initialFields.length > 0) {
			const newNodes = initializeNodesFromFields(initialFields);
			const newRootIds = extractRootIds(initialFields, newNodes);
			setNodes(newNodes);
			setRootIds(newRootIds);
		}
	}, [initialFields]);


	const effectiveIsPostType = isPostType || isPostTypeFromUrl;

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	// Add new field to tree
	const handleAddField = useCallback((fieldType, parentId = null) => {
		const isContainer = fieldType === 'section' || fieldType === 'meta_box';
		const isGroupOrRepeater = fieldType === 'group' || fieldType === 'repeater';

		const newId = generateUniqueId();

		// Initialize default values from fieldConfigurations
		const defaultValues = initializeFieldDefaults(fieldType);

		const newNode = {
			id: newId,
			fieldType,
			name: '',
			fieldLabel: '',
			parentId: parentId,
			// Spread the default values from fieldConfigurations
			...defaultValues
		};

		// Add children property for containers (section, meta_box, group, repeater)
		if (isContainer || isGroupOrRepeater) {
			newNode.children = [];
		}

		setNodes(prev => {
			const updated = {...prev, [newId]: newNode};

			// If adding to a parent container, add to its children
			if (parentId) {
				updated[parentId] = {
					...updated[parentId],
					children: [...(updated[parentId].children || []), newId]
				};
			}

			return updated;
		});

		// Only add to rootIds if no parent
		if (!parentId) {
			setRootIds(prev => {
				return [...prev, newId];
			});
		}

		setSelectedNodeId(newId);
		setHasChanges(true); // Mark form as changed
	}, []);

	// Handle adding field to a specific container (section/meta_box)
	const handleAddFieldToContainer = useCallback((containerId) => {
		setFieldModalTargetContainer(containerId);
		setIsFieldModalOpen(true);
	}, []);

	// Handle field selection from modal
	const handleFieldModalSelect = useCallback((fieldType) => {
		if (fieldModalTargetContainer) {
			handleAddField(fieldType, fieldModalTargetContainer);
		}
		setIsFieldModalOpen(false);
		setFieldModalTargetContainer(null);
	}, [fieldModalTargetContainer, handleAddField]);

	// Update node
	const handleUpdateNode = useCallback((nodeId, updates) => {
		setNodes(prev => ({
			...prev,
			[nodeId]: {
				...prev[nodeId],
				...updates,
			}
		}));
		setHasChanges(true); // Mark form as changed
	}, []);

	// Delete node
	const handleDeleteNode = useCallback((nodeId) => {
		const node = nodes[nodeId];

		// Special warning for section/meta_box with children
		if ((node.fieldType === 'section' || node.fieldType === 'meta_box') && node.children && node.children.length > 0) {
			const childCount = node.children.length;
			const message = __('This container has %d field(s) inside. All fields will be deleted. Are you sure?', 'native-custom-fields').replace('%d', childCount);
			if (!window.confirm(message)) {
				return;
			}
		}

		// Remove from parent's children or root
		if (node.parentId) {
			setNodes(prev => ({
				...prev,
				[node.parentId]: {
					...prev[node.parentId],
					children: prev[node.parentId].children.filter(id => id !== nodeId)
				}
			}));
		} else {
			setRootIds(prev => prev.filter(id => id !== nodeId));
		}

		// Remove node and all its children recursively
		const nodesToDelete = [nodeId];
		if (node.children) {
			const collectChildren = (id) => {
				const n = nodes[id];
				if (n && n.children) {
					n.children.forEach(childId => {
						nodesToDelete.push(childId);
						collectChildren(childId);
					});
				}
			};
			node.children.forEach(collectChildren);
		}

		setNodes(prev => {
			const newNodes = {...prev};
			nodesToDelete.forEach(id => delete newNodes[id]);
			return newNodes;
		});

		if (selectedNodeId === nodeId) {
			setSelectedNodeId(null);
		}

		setHasChanges(true); // Mark form as changed
	}, [nodes, selectedNodeId]);

	// Duplicate a field (with all its children if container)
	const handleDuplicateField = useCallback((nodeId) => {
		const node = nodes[nodeId];
		if (!node) return;

		const newId = generateUniqueId();
		const duplicatedNode = deepClone(node);

		// Update name and fieldLabel with _copy suffix
		duplicatedNode.id = newId;
		duplicatedNode.name = duplicatedNode.name ? duplicatedNode.name + '_copy' : '';
		duplicatedNode.fieldLabel = duplicatedNode.fieldLabel ? duplicatedNode.fieldLabel + ' Copy' : '';

		// Helper function to recursively duplicate children and update their IDs
		const duplicateChildren = (children) => {
			if (!children || !Array.isArray(children)) return [];

			return children.map(childId => {
				const childNode = nodes[childId];
				if (!childNode) return null;

				const newChildId = generateUniqueId();
				const duplicatedChild = deepClone(childNode);
				duplicatedChild.id = newChildId;
				duplicatedChild.name = duplicatedChild.name ? duplicatedChild.name + '_copy' : '';
				duplicatedChild.fieldLabel = duplicatedChild.fieldLabel ? duplicatedChild.fieldLabel + ' Copy' : '';
				duplicatedChild.parentId = newId;

				// Recursively duplicate grandchildren
				if (duplicatedChild.children && duplicatedChild.children.length > 0) {
					const newGrandchildrenIds = duplicateChildren(duplicatedChild.children);
					duplicatedChild.children = newGrandchildrenIds.map(gc => gc.id);

					// Add grandchildren to nodes
					newGrandchildrenIds.forEach(gc => {
						setNodes(prev => ({...prev, [gc.id]: gc}));
					});
				}

				return duplicatedChild;
			}).filter(Boolean);
		};

		// Duplicate all children if this is a container
		let newChildrenIds = [];
		if (duplicatedNode.children && duplicatedNode.children.length > 0) {
			const duplicatedChildren = duplicateChildren(duplicatedNode.children);
			newChildrenIds = duplicatedChildren.map(child => child.id);
			duplicatedNode.children = newChildrenIds;

			// Add all duplicated children to nodes
			duplicatedChildren.forEach(child => {
				setNodes(prev => ({...prev, [child.id]: child}));
			});
		}

		// Add the duplicated node
		setNodes(prev => ({...prev, [newId]: duplicatedNode}));

		// Insert into parent's children or rootIds (right after the original)
		if (node.parentId) {
			setNodes(prev => {
				const parent = prev[node.parentId];
				if (!parent) return prev;

				const childrenArray = [...(parent.children || [])];
				const currentIndex = childrenArray.indexOf(nodeId);
				childrenArray.splice(currentIndex + 1, 0, newId);

				return {
					...prev,
					[node.parentId]: {
						...parent,
						children: childrenArray
					}
				};
			});
		} else {
			setRootIds(prev => {
				const rootArray = [...prev];
				const currentIndex = rootArray.indexOf(nodeId);
				rootArray.splice(currentIndex + 1, 0, newId);
				return rootArray;
			});
		}

		setHasChanges(true);
	}, [nodes]);

	// Move field up with animation
	const handleMoveFieldUp = useCallback((nodeId) => {
		const node = nodes[nodeId];
		if (!node) return;

		// Get siblings array
		const siblingsArray = node.parentId ? nodes[node.parentId]?.children : rootIds;
		if (!siblingsArray) return;

		const currentIndex = siblingsArray.indexOf(nodeId);

		// Validate: cannot move up if already first
		if (currentIndex <= 0) return;

		const targetNodeId = siblingsArray[currentIndex - 1];

		// Set animation state
		setAnimatingNodes({
			[targetNodeId]: 'hide-not-moving',
			[nodeId]: 'moving-up'
		});

		// Clear any existing animation timeouts
		if (animationTimeoutRef.current) {
			clearTimeout(animationTimeoutRef.current);
		}

		// Wait for animation to complete before updating the state
		animationTimeoutRef.current = setTimeout(() => {
			if (!isMounted.current) return;

			// Swap positions
			if (node.parentId) {
				setNodes(prev => {
					const parent = prev[node.parentId];
					const newChildren = [...parent.children];
					[newChildren[currentIndex - 1], newChildren[currentIndex]] = [newChildren[currentIndex], newChildren[currentIndex - 1]];

					return {
						...prev,
						[node.parentId]: {
							...parent,
							children: newChildren
						}
					};
				});
			} else {
				setRootIds(prev => {
					const newRootIds = [...prev];
					[newRootIds[currentIndex - 1], newRootIds[currentIndex]] = [newRootIds[currentIndex], newRootIds[currentIndex - 1]];
					return newRootIds;
				});
			}

			setAnimatingNodes({});
			setHasChanges(true);
		}, 300); // Animation duration
	}, [nodes, rootIds]);

	// Move field down with animation
	const handleMoveFieldDown = useCallback((nodeId) => {
		const node = nodes[nodeId];
		if (!node) return;

		// Get siblings array
		const siblingsArray = node.parentId ? nodes[node.parentId]?.children : rootIds;
		if (!siblingsArray) return;

		const currentIndex = siblingsArray.indexOf(nodeId);

		// Validate: cannot move down if already last
		if (currentIndex < 0 || currentIndex >= siblingsArray.length - 1) return;

		const targetNodeId = siblingsArray[currentIndex + 1];

		// Set animation state
		setAnimatingNodes({
			[nodeId]: 'moving-down',
			[targetNodeId]: 'hide-not-moving'
		});

		// Clear any existing animation timeouts
		if (animationTimeoutRef.current) {
			clearTimeout(animationTimeoutRef.current);
		}

		// Wait for animation to complete before updating the state
		animationTimeoutRef.current = setTimeout(() => {
			if (!isMounted.current) return;

			// Swap positions
			if (node.parentId) {
				setNodes(prev => {
					const parent = prev[node.parentId];
					const newChildren = [...parent.children];
					[newChildren[currentIndex], newChildren[currentIndex + 1]] = [newChildren[currentIndex + 1], newChildren[currentIndex]];

					return {
						...prev,
						[node.parentId]: {
							...parent,
							children: newChildren
						}
					};
				});
			} else {
				setRootIds(prev => {
					const newRootIds = [...prev];
					[newRootIds[currentIndex], newRootIds[currentIndex + 1]] = [newRootIds[currentIndex + 1], newRootIds[currentIndex]];
					return newRootIds;
				});
			}

			setAnimatingNodes({});
			setHasChanges(true);
		}, 300); // Animation duration
	}, [nodes, rootIds]);

	// Handle drag start
	const handleDragStart = (event) => {
		setActiveId(event.active.id);
	};

	// Handle drag end
	const handleDragEnd = (event) => {
		const {active, over} = event;
		setActiveId(null);

		if (!over || active.id === over.id) {
			return;
		}

		const activeNode = nodes[active.id];
		if (!activeNode) return;

		// Helper: Check if node is a container (section or meta_box)
		const isContainer = (node) => node && (node.fieldType === 'section' || node.fieldType === 'meta_box');

		// Helper: Check if node is inside a container
		const isInsideContainer = (nodeId) => {
			let current = nodes[nodeId];
			while (current && current.parentId) {
				const parent = nodes[current.parentId];
				if (isContainer(parent)) return true;
				current = parent;
			}
			return false;
		};

		// Check if dropping into children container (dropzone)
		const isChildrenDropZone = over.id && typeof over.id === 'string' && over.id.endsWith('-children-dropzone');

		if (isChildrenDropZone) {
			// Extract parent ID from dropzone ID
			const parentId = over.id.replace('-children-dropzone', '');
			const parentNode = nodes[parentId];

			if (!parentNode || !activeNode) {
				return;
			}

			// Prevent dropping into own descendants
			if (isDescendant(active.id, parentId, nodes)) {
				return;
			}

			// RULE: Containers (section/meta_box) can only be at root level
			if (isContainer(activeNode)) {
				alert(__('Sections and Meta Boxes can only be placed at the root level.', 'native-custom-fields'));
				return;
			}

			// RULE: Parent must be a container type that can accept children
			const canParentHaveChildren = parentNode.fieldType === 'section' ||
				parentNode.fieldType === 'meta_box' ||
				parentNode.fieldType === 'group' ||
				parentNode.fieldType === 'repeater';

			if (!canParentHaveChildren) {
				alert(__('This field type cannot contain child fields.', 'native-custom-fields'));
				return;
			}

			// Move field into parent's children
			setNodes(prev => {
				const newNodes = {...prev};

				// Remove from old location
				if (activeNode.parentId) {
					newNodes[activeNode.parentId] = {
						...newNodes[activeNode.parentId],
						children: newNodes[activeNode.parentId].children.filter(id => id !== active.id)
					};
				}

				// Add to new parent
				newNodes[parentId] = {
					...newNodes[parentId],
					children: [...(newNodes[parentId].children || []), active.id]
				};

				newNodes[active.id] = {
					...newNodes[active.id],
					parentId: parentId
				};

				return newNodes;
			});

			// Remove from rootIds if was in root
			if (!activeNode.parentId) {
				setRootIds(prev => prev.filter(id => id !== active.id));
			}

			return;
		}

		const overNode = nodes[over.id];

		if (!activeNode || !overNode) {
			return;
		}

		// Prevent dropping a node into its own descendants
		if (isDescendant(active.id, over.id, nodes)) {
			return;
		}

		// RULE: Containers (section/meta_box) can only be at root level
		if (isContainer(activeNode) && overNode.parentId !== null) {
			alert(__('Sections and Meta Boxes can only be placed at the root level.', 'native-custom-fields'));
			return;
		}

		// RULE: Non-container fields cannot be moved to root if they're inside a container
		if (!isContainer(activeNode) && overNode.parentId === null && isInsideContainer(active.id)) {
			alert(__('Fields inside a Section or Meta Box cannot be moved to the root level. Move them to another container instead.', 'native-custom-fields'));
			return;
		}

		// Check if target CAN accept children (type check)
		const canTargetHaveChildren = overNode.fieldType === 'group' ||
			overNode.fieldType === 'repeater' ||
			overNode.fieldType === 'section' ||
			overNode.fieldType === 'meta_box';

		// Determine if we should drop AS CHILD or AS SIBLING
		// If target is group/repeater/section/meta_box AND has no children yet, drop as child
		// Otherwise drop as sibling
		const hasNoChildren = !overNode.children || overNode.children.length === 0;
		const dropAsChild = canTargetHaveChildren && hasNoChildren;

		// Same parent reordering
		if (!dropAsChild && activeNode.parentId === overNode.parentId) {
			if (activeNode.parentId === null) {
				// Reorder in rootIds
				setRootIds(prev => {
					const oldIndex = prev.indexOf(active.id);
					const newIndex = prev.indexOf(over.id);

					if (oldIndex === -1 || newIndex === -1) return prev;

					const newArray = [...prev];
					newArray.splice(oldIndex, 1);
					newArray.splice(newIndex, 0, active.id);

					return newArray;
				});
			} else {
				// Reorder within parent's children
				setNodes(prev => {
					const parentId = activeNode.parentId;
					const parent = prev[parentId];
					if (!parent || !parent.children) return prev;

					const oldIndex = parent.children.indexOf(active.id);
					const newIndex = parent.children.indexOf(over.id);

					if (oldIndex === -1 || newIndex === -1) return prev;

					const newChildren = [...parent.children];
					newChildren.splice(oldIndex, 1);
					newChildren.splice(newIndex, 0, active.id);

					return {
						...prev,
						[parentId]: {
							...parent,
							children: newChildren
						}
					};
				});
			}
			return;
		}

		// Different parent or drop as child - full move logic
		setNodes(prev => {
			const newNodes = {...prev};

			if (activeNode.parentId) {
				// Remove from old parent's children
				newNodes[activeNode.parentId] = {
					...newNodes[activeNode.parentId],
					children: newNodes[activeNode.parentId].children.filter(id => id !== active.id)
				};
			}

			// Add to new location
			if (dropAsChild && canTargetHaveChildren) {
				// RULE: Containers cannot be dropped inside other nodes
				if (isContainer(activeNode)) {
					alert(__('Sections and Meta Boxes can only be placed at the root level.', 'native-custom-fields'));
					return prev;
				}

				// Drop inside group/repeater/section/meta_box
				newNodes[over.id] = {
					...newNodes[over.id],
					children: [...(newNodes[over.id].children || []), active.id]
				};
				newNodes[active.id] = {
					...newNodes[active.id],
					parentId: over.id
				};
			} else {
				// Drop as sibling
				const targetParentId = overNode.parentId;

				// RULE: If active is a container, it must go to root (targetParentId must be null)
				if (isContainer(activeNode) && targetParentId !== null) {
					alert(__('Sections and Meta Boxes can only be placed at the root level.', 'native-custom-fields'));
					return prev;
				}

				// RULE: Non-container fields cannot be moved to root if they're inside a container
				if (!isContainer(activeNode) && targetParentId === null && isInsideContainer(active.id)) {
					alert(__('Fields inside a Section or Meta Box cannot be moved to the root level. Move them to another container instead.', 'native-custom-fields'));
					return prev;
				}

				newNodes[active.id] = {
					...newNodes[active.id],
					parentId: targetParentId
				};

				if (targetParentId) {
					// Insert as sibling in parent's children
					const parentChildren = newNodes[targetParentId].children.filter(id => id !== active.id);
					const targetIndex = parentChildren.indexOf(over.id);

					newNodes[targetParentId] = {
						...newNodes[targetParentId],
						children: [
							...parentChildren.slice(0, targetIndex + 1),
							active.id,
							...parentChildren.slice(targetIndex + 1)
						]
					};
				}
			}

			return newNodes;
		});

		// Update rootIds for cross-parent moves
		if (!dropAsChild || !canTargetHaveChildren) {
			if (activeNode.parentId === null && overNode.parentId !== null) {
				// Moving from root to child
				setRootIds(prev => prev.filter(id => id !== active.id));
			} else if (activeNode.parentId !== null && overNode.parentId === null) {
				// Moving from child to root
				setRootIds(prev => {
					if (prev.includes(active.id)) return prev;
					const filtered = prev.filter(id => id !== active.id);
					const overIndex = filtered.indexOf(over.id);
					return [
						...filtered.slice(0, overIndex + 1),
						active.id,
						...filtered.slice(overIndex + 1)
					];
				});
			}
		} else {
			// Moving into group/repeater
			if (activeNode.parentId === null) {
				setRootIds(prev => prev.filter(id => id !== active.id));
			}
		}

		setHasChanges(true); // Mark form as changed after drag operation
	};

	// Validate required fields before save
	const validateTreeFields = useCallback(() => {
		const missingFields = [];
		const fieldNames = new Set();
		const duplicateNames = new Set();

		// First check: Must have at least one section or meta_box
		if (rootIds.length === 0) {
			return {
				isValid: false,
				message: __('You must create at least one Section or Meta Box before saving.', 'native-custom-fields')
			};
		}

		// Get required field names from fieldConfigurations
		const getRequiredFields = () => {
			const requiredFields = [];

			// Helper function to recursively extract required fields from nested structures
			const extractRequiredFields = (fields) => {
				if (!fields) return;

				if (Array.isArray(fields)) {
					fields.forEach(field => {
						if (field.required === true && field.name) {
							requiredFields.push({
								name: field.name,
								label: field.fieldLabel || field.name
							});
						}
						// Check nested fields (for group fields)
						if (field.fields) {
							extractRequiredFields(field.fields);
						}
					});
				}
			};

			extractRequiredFields(fieldConfigurations);
			return requiredFields;
		};

		const requiredFieldsList = getRequiredFields();
		// Convert to Map for faster lookup
		const requiredFieldsMap = new Map(requiredFieldsList.map(f => [f.name, f.label]));

		// Check all nodes for required fields and duplicate names
		const checkNode = (node) => {
			const nodeLabel = node.fieldLabel || node.name || node.fieldType || __('Unnamed field', 'native-custom-fields');

			// Check only the fields that exist in this node AND are marked as required
			Object.keys(node).forEach(nodeFieldName => {
				// Skip internal/UI fields
				if (nodeFieldName === 'id' || nodeFieldName === 'parentId' ||
				    nodeFieldName === 'children' || nodeFieldName === 'fieldType') {
					return;
				}

				// Check if this field is required in fieldConfigurations
				if (requiredFieldsMap.has(nodeFieldName)) {
					const fieldValue = node[nodeFieldName];
					const isEmpty = fieldValue === undefined ||
					                fieldValue === null ||
					                fieldValue === '' ||
					                (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
					                (Array.isArray(fieldValue) && fieldValue.length === 0);

					if (isEmpty) {
						const fieldLabel = requiredFieldsMap.get(nodeFieldName);
						missingFields.push({
							fieldLabel: nodeLabel,
							issue: `${fieldLabel} ${__('is required', 'native-custom-fields')}`
						});
					}
				}
			});

			// Check for duplicate field names (only for fields, not sections/meta_boxes)
			if (node.name && node.name.trim() !== '') {
				if (node.fieldType !== 'section' && node.fieldType !== 'meta_box') {
					if (fieldNames.has(node.name)) {
						duplicateNames.add(node.name);
					} else {
						fieldNames.add(node.name);
					}
				}
			}

			// Recursively check children if this is a container
			if (node.children && node.children.length > 0) {
				node.children.forEach(childId => {
					const childNode = nodes[childId];
					if (childNode) {
						checkNode(childNode);
					}
				});
			}
		};

		// Check all root nodes
		rootIds.forEach(nodeId => {
			const node = nodes[nodeId];
			if (node) {
				checkNode(node);
			}
		});

		// Prepare error messages
		const errors = [];

		if (missingFields.length > 0) {
			const errorMessages = missingFields.map(field =>
				`• ${field.fieldLabel}: ${field.issue}`
			).join('<br>');
			errors.push(errorMessages);
		}

		if (duplicateNames.size > 0) {
			const duplicateList = Array.from(duplicateNames).map(name => `• ${name}`).join('<br>');
			errors.push(
				__('Duplicate field names found (field names must be unique):', 'native-custom-fields') +
				'<br>' + duplicateList
			);
		}

		if (errors.length > 0) {
			return {
				isValid: false,
				message: __('Please fix the following issues:', 'native-custom-fields') + '<br><br>' + errors.join('<br><br>')
			};
		}

		return { isValid: true };
	}, [nodes, rootIds]);

	// Handle save
	const handleSave = useCallback(async () => {

		setIsSaving(true);
		setSaveMessage(null);

		// Validate fields before saving
		const validation = validateTreeFields();

		if (!validation.isValid) {
			setSaveMessage({
				type: 'error',
				content: validation.message
			});
			setIsSaving(false);
			return;
		}

		try {
			// Transform tree state to field schema
			const fieldSchema = transformTreeToFieldSchema(nodes, rootIds);
			const urlParams = new URLSearchParams(window.location.search);

			const sectionOrMetaBoxResult = {
				menu_slug: urlParams.get('menu_slug'),
				sections_or_meta_boxes: fieldSchema
			}

			if (onSave) {
				await onSave(sectionOrMetaBoxResult);
			}

			setHasChanges(false);
			setSaveMessage({
				type: 'success',
				content: __('Fields saved successfully!', 'native-custom-fields')
			});
		} catch (error) {
			console.error('Save failed:', error);
			setSaveMessage({
				type: 'error',
				content: error.message || __('Failed to save fields.', 'native-custom-fields')
			});
		} finally {
			setIsSaving(false);
		}

	}, [nodes, rootIds, onSave, validateTreeFields]);

	return (
		<>
			<div className="gf-tree-view-form">
				<div className="gf-tree-view-form__header">
					<div className="gf-tree-view-form__header-titles">
						<h2>{pageTitle}</h2>
						{contextType && contextType !== 'user' && (
							<div className="gf-tree-view-form__header-subtitle">
								{contextType === 'options' && (
									<span>
										{__('Options Page:', 'native-custom-fields')} <strong>{contextValue}</strong>
									</span>
								)}
								{contextType === 'post_type' && (
									<span>
										{__('Post Type:', 'native-custom-fields')} <strong>{contextValue}</strong>
									</span>
								)}
								{contextType === 'taxonomy' && (
									<span>
										{__('Taxonomy:', 'native-custom-fields')} <strong>{contextValue}</strong>
									</span>
								)}
							</div>
						)}
					</div>
					<div className="gf-tree-view-form__header-actions">
						<FieldPalette
							onAddField={handleAddField}
							mode="container"
							isPostType={effectiveIsPostType}
						/>
					</div>
				</div>

				<div className="gf-tree-view-form__content">
					<div className="gf-tree-view-form__sidebar">
						<Panel className="gf-tree-view-form__tree-panel">
							<PanelBody title={__('List View', 'native-custom-fields')} initialOpen={true}>
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragStart={handleDragStart}
									onDragEnd={handleDragEnd}
								>
									<SortableContext items={rootIds} strategy={verticalListSortingStrategy}>
										<div className="gf-tree-view-form__tree">
											{rootIds.map(nodeId => {
												const node = nodes[nodeId];
												if (!node) return null;

												return (
													<TreeNode
														key={nodeId}
														nodeId={nodeId}
														node={node}
														nodes={nodes}
														level={0}
														selectedNodeId={selectedNodeId}
														onSelectNode={setSelectedNodeId}
														onDeleteNode={handleDeleteNode}
														onAddFieldToContainer={handleAddFieldToContainer}
														onDuplicateField={handleDuplicateField}
														onMoveFieldUp={handleMoveFieldUp}
														onMoveFieldDown={handleMoveFieldDown}
														animatingNodes={animatingNodes}
														rootIds={rootIds}
													/>
												);
											})}
										</div>
									</SortableContext>
									<DragOverlay>
										{activeId && nodes[activeId] ? (
											<div className="gf-tree-node--dragging">
												{nodes[activeId].fieldLabel || nodes[activeId].fieldType || 'Field'}
											</div>
										) : null}
									</DragOverlay>
								</DndContext>
							</PanelBody>
						</Panel>
					</div>

				<div className="gf-tree-view-form__main">
					<FieldSettingsPanel
						nodeId={selectedNodeId}
						node={selectedNodeId ? nodes[selectedNodeId] : null}
						onUpdateNode={handleUpdateNode}
					/>
				</div>
			</div>

			{saveMessage && (
				<Notice
					className="native-custom-fields-notice"
					status={saveMessage.type}
					isDismissible={true}
					__unstableHTML={true}
					onRemove={() => setSaveMessage(null)}
				>
					{saveMessage.content}
				</Notice>
			)}

			<div className="gf-tree-view-form__footer">
				<ActionButtons
					onSave={handleSave}
					isSaving={isSaving}
					hasChanges={hasChanges}
					resetForm={false}
				/>
			</div>
		</div>

		{/* Field Modal for adding fields to containers */}
			{isFieldModalOpen && (
				<Modal
					title={__('Add Field', 'native-custom-fields')}
					onRequestClose={() => {
						setIsFieldModalOpen(false);
						setFieldModalTargetContainer(null);
					}}
					className="gf-field-palette-modal"
				>
					<FieldPaletteGrid
						onAddField={handleFieldModalSelect}
						mode="field"
					/>
				</Modal>
			)}
		</>
	);
};

// Helper: Check if targetId is a descendant of nodeId
function isDescendant(nodeId, targetId, nodes) {
	const node = nodes[targetId];
	if (!node) return false;
	if (node.parentId === nodeId) return true;
	if (node.parentId === null) return false;
	return isDescendant(nodeId, node.parentId, nodes);
}

/**
 * Helper: Process fields and extract default values
 * This recursively processes group and repeater fields to extract their default values
 */
function processFieldsForDefaults(fieldsArray) {
	const data = {};

	for (const field of fieldsArray) {
		// Skip if the field doesn't have a name
		if (!field.name) {
			continue;
		}

		// Process based on the field type
		if (field.fieldType === 'repeater') {
			const repeaterItems = [];
			// If there's a 'min' property, create that many default items
			const minItems = field.min || 0;

			for (let i = 0; i < minItems; i++) {
				// Call the function again for the fields inside the repeater (recursion)
				repeaterItems.push(processFieldsForDefaults(field.fields));
			}
			data[field.name] = repeaterItems;

		} else if (field.fieldType === 'group') {
			// Call the function again for the fields inside the group (recursion)
			data[field.name] = processFieldsForDefaults(field.fields);

		} else {
			// For simple fields (text, toggle, etc.)
			// Use the 'default' value if it exists, otherwise assign null
			data[field.name] = field.default !== undefined ? field.default : null;
		}
	}

	return data;
}

/**
 * Helper: Initialize default values for a new field from fieldConfigurations
 * This ensures new fields have proper default values
 */
function initializeFieldDefaults(fieldType) {
	// Extract default values from fieldConfigurations
	const defaultValues = processFieldsForDefaults(fieldConfigurations);

	// Return only non-null values (filter out empty structures)
	const cleanDefaults = {};
	Object.keys(defaultValues).forEach(key => {
		const value = defaultValues[key];
		// Include the value if it's not null and not an empty object/array
		if (value !== null) {
			if (typeof value === 'object') {
				// For objects/arrays, check if they have content
				const hasContent = Array.isArray(value)
					? value.length > 0
					: Object.keys(value).length > 0;
				if (hasContent) {
					cleanDefaults[key] = value;
				}
			} else {
				cleanDefaults[key] = value;
			}
		}
	});

	return cleanDefaults;
}

// Helper: Initialize nodes from existing field schema
function initializeNodesFromFields(fields, parentId = null) {
	const nodes = {};

	const processField = (field, parent = null) => {
		const id = generateUniqueId();

		// Copy all field properties except 'fields' (which becomes 'children')
		const {fields: childFields, ...fieldWithoutChildren} = field;

		const node = {
			id,
			...fieldWithoutChildren,
			parentId: parent,
		};

		// If field has children (group or repeater or section or meta_box)
		if (childFields && Array.isArray(childFields)) {
			node.children = [];
			childFields.forEach(childField => {
				const childId = processField(childField, id);
				node.children.push(childId);
			});
		}

		nodes[id] = node;
		return id;
	};

	fields.forEach(field => processField(field, parentId));

	return nodes;
}

// Helper: Extract root IDs
function extractRootIds(fields, nodes) {
	const rootIds = [];
	Object.keys(nodes).forEach(nodeId => {
		if (nodes[nodeId].parentId === null) {
			rootIds.push(nodeId);
		}
	});
	return rootIds;
}

export default TreeViewForm;
