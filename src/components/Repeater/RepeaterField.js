import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { copy, dragHandle, plus, trash } from '@wordpress/icons';
import RenderFields from "../../render/RenderFields";
import { CustomPanel } from "@nativecustomfields/components/index.js";
import { createEmptyItem, deepClone } from "@nativecustomfields/common/helper.js";

// Find the first field path marked with setAsRepeaterItemTag (skips nested repeaters to avoid ambiguity)
const findRepeaterItemTagPath = (fields = [], parentPath = []) => {
	for (const field of fields) {
		if (!field || !field.name) continue;
		const currentPath = [...parentPath, field.name];
		if (field.setAsRepeaterItemTag) {
			return currentPath;
		}
		const hasNestedFields = Array.isArray(field.fields) && field.fields.length > 0 && field.fieldType !== 'repeater';
		if (hasNestedFields) {
			const nested = findRepeaterItemTagPath(field.fields, currentPath);
			if (nested) return nested;
		}
	}
	return null;
};

// Safely read a value from an item via path and normalize to string
const getRepeaterItemTagValue = (item, path) => {
	if (!path || path.length === 0) return '';
	let current = item;
	for (const key of path) {
		if (current && Object.prototype.hasOwnProperty.call(current, key)) {
			current = current[key];
		} else {
			return '';
		}
	}
	if (current === undefined || current === null) return '';
	return (typeof current === 'string' || typeof current === 'number') ? String(current) : '';
};

/**
 * Renders a group of fields as an array of objects
 *
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {string} props.name Field name
 * @param {Array} props.fields Fields to render inside each group item
 * @param {Object} props.values Form values object
 * @param {Function} props.onChange Value change handler
 * @param {string} [props.addButtonText='Add Item'] Text for the add button
 * @param {number} [props.min=1] Minimum number of items
 * @param {number} [props.max=10] Maximum number of items
 * @param {string} [props.className=''] Additional CSS class names
 * @returns {React.ReactElement} Repeater field component
 */
const RepeaterField = (
	{
		name,
		fields,
		values = {},
		onChange,
		addButtonText = __('Add Item', 'native-custom-fields'),
		min = 0,
		max = 50,
		className = '',
		initialOpen = true,
		layout = 'panel'
	}) => {

	// State to manage group items
	const [groupItems, setGroupItems] = useState([]);
	// Sync guard to prevent onChange ping-pong when syncing from props
	const isSyncingFromProps = useRef(false);
	// Track previous values to detect real changes
	const prevValuesRef = useRef();
	const isFirstRender = useRef(true);

	// Helper: deep compare arrays/objects
	const deepEqual = (obj1, obj2) => {
		if (obj1 === obj2) return true;
		if (obj1 == null || obj2 == null) return false;
		if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;

		if (Array.isArray(obj1) && Array.isArray(obj2)) {
			if (obj1.length !== obj2.length) return false;
			for (let i = 0; i < obj1.length; i++) {
				if (!deepEqual(obj1[i], obj2[i])) return false;
			}
			return true;
		}

		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) return false;

		for (let key of keys1) {
			if (!keys2.includes(key)) return false;
			if (!deepEqual(obj1[key], obj2[key])) return false;
		}

		return true;
	};

	// Animation state
	const [animatingItems, setAnimatingItems] = useState({});
	const animationTimeoutRef = useRef(null);

	//Drag and Drop
	const [draggedItemIndex, setDraggedItemIndex] = useState(null);
	const [dragOverItemIndex, setDragOverItemIndex] = useState(null);
	const [dropPosition, setDropPosition] = useState(null); // 'above', 'below'
	const autoScrollIntervalRef = useRef(null);
	const globalDragOverHandlerRef = useRef(null);

	// Use a ref to track if component is mounted
	const isMounted = useRef(true);
	// Use a counter to force re-renders when needed
	const [renderKey, setRenderKey] = useState(0);

	const [modifiedFields, setModifiedFields] = useState([]);
	const repeaterItemTagPath = useMemo(() => findRepeaterItemTagPath(modifiedFields), [modifiedFields]);

	// Track panel open/close states for each item
	const [panelStates, setPanelStates] = useState({});

	// Set mount/unmount status
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		// Set hasParent flag on fields to inform nested fields
		let newFields = [];
		if (fields && Array.isArray(fields)) {
			newFields = [
				...fields.map(field => ({
					...field,
					hasParent: true
				}))
			];

			setModifiedFields(newFields);
		}
	}, [fields]);

	// Initialize and sync group items from external values (array or object[name])
	useEffect(() => {
		const incoming = Array.isArray(values)
			? values
			: (values && Array.isArray(values[name]) ? values[name] : []);


		// On first render, always initialize
		if (isFirstRender.current) {
			isFirstRender.current = false;
			isSyncingFromProps.current = true; // Set sync flag to prevent initial onChange call

			if (incoming && incoming.length > 0) {
				const clonedIncoming = deepClone(incoming);
				prevValuesRef.current = clonedIncoming;
				setGroupItems(clonedIncoming);
			} else if (min > 0) {
				const emptyItems = Array.from({ length: min }, () => createEmptyItem(fields));
				prevValuesRef.current = emptyItems;
				setGroupItems(emptyItems);
			} else {
				// Even for empty array, set sync flag to prevent onChange
				prevValuesRef.current = [];
				setGroupItems([]);
			}
			return;
		}

		// Check if incoming values actually changed using deep comparison
		const valuesChanged = !deepEqual(prevValuesRef.current, incoming);

		if (!valuesChanged) {
			return;
		}

		if (incoming && incoming.length > 0) {
			isSyncingFromProps.current = true;
			const clonedIncoming = deepClone(incoming);
			prevValuesRef.current = clonedIncoming;
			setGroupItems(clonedIncoming);
		} else if (min > 0 && groupItems.length === 0) {
			const emptyItems = Array.from({ length: min }, () => createEmptyItem(fields));
			prevValuesRef.current = emptyItems;
			setGroupItems(emptyItems);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values, name, min]);

	// Keep panelStates in sync with groupItems length; preserve known states
	useEffect(() => {
		if (!Array.isArray(groupItems)) return;
		setPanelStates(prev => {
			const next = {};
			for (let i = 0; i < groupItems.length; i++) {
				next[i] = Object.prototype.hasOwnProperty.call(prev, i) ? prev[i] : !!initialOpen;
			}
			return next;
		});
	}, [groupItems.length, initialOpen]);

	// Update the parent form when group items change
	useEffect(() => {
		if (!onChange) return;
		if (isSyncingFromProps.current) {
			// Skip notifying parent when we just synced from props
			isSyncingFromProps.current = false;
			return;
		}
		onChange(name, deepClone(groupItems));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupItems]);

	// Handle individual field change within a group item
	const handleItemChange = (itemIndex, fieldName, fieldValue) => {
		setGroupItems(prevItems => {
			const updatedItems = deepClone(prevItems);
			updatedItems[itemIndex] = {
				...updatedItems[itemIndex],
				[fieldName]: fieldValue,
			};
			return updatedItems;
		});
	};

	// Add a new item to the group
	const addItem = () => {
		if (groupItems.length < max) {
			setGroupItems(prevItems => {
				return [...deepClone(prevItems), createEmptyItem(fields)];
			});
			// Only set the new panel state, preserve existing
			setPanelStates(prev => ({
				...prev,
				[groupItems.length]: !!initialOpen
			}));
		}
	};

	// Remove an item from the group
	const removeItem = (index) => {
		if (confirm(__('Are you sure you want to delete this item?', 'native-custom-fields'))) {
			setGroupItems(prevItems => {
				const newItems = deepClone(prevItems);
				newItems.splice(index, 1);
				return newItems;
			});
			// Reindex panel states after removal
			setPanelStates(prev => {
				const updated = {};
				Object.keys(prev).forEach(k => {
					const key = parseInt(k, 10);
					if (Number.isNaN(key)) return;
					if (key < index) {
						updated[key] = prev[key];
					} else if (key > index) {
						updated[key - 1] = prev[key];
					}
				});
				return updated;
			});
		}
	};

	// Copy an item and insert right after current index
	const copyItem = (index) => {
		if (groupItems.length >= max) return;

		// Duplicate data
		setGroupItems(prevItems => {
			const newItems = deepClone(prevItems);
			let duplicated = deepClone(newItems[index]);
			duplicated.name = duplicated.name + '_copy';
			duplicated.fieldLabel = duplicated.fieldLabel + ' Copy'
			newItems.splice(index + 1, 0, duplicated);
			return newItems;
		});

		// Adjust panel states to keep alignment and apply same state to the copy
		setPanelStates(prev => {
			const updated = {};
			Object.keys(prev).forEach(k => {
				const key = parseInt(k, 10);
				if (Number.isNaN(key)) return;
				if (key <= index) {
					updated[key] = prev[key];
				} else {
					updated[key + 1] = prev[key];
				}
			});
			updated[index + 1] = prev[index] !== undefined ? prev[index] : !!initialOpen;
			return updated;
		});
	};

	// Move an item up in the order with animation
	const moveItemUp = (index) => {
		if (index > 0) {
			// Save current panel states before move
			const currentPanelState = getPanelState(index);
			const targetPanelState = getPanelState(index - 1);

			// Set animation state
			setAnimatingItems({
				[index - 1]: 'hide-not-moving',
				[index]: 'moving-up'
			});

			// Clear any existing animation timeouts
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}

			// Wait for animation to complete before updating the state
			animationTimeoutRef.current = setTimeout(() => {
				if (!isMounted.current) return;

				setGroupItems(prevItems => {
					const newItems = deepClone(prevItems);
					const temp = newItems[index];
					newItems[index] = newItems[index - 1];
					newItems[index - 1] = temp;
					return newItems;
				});

				// Swap panel states to maintain open/close status
				setPanelStates(prev => ({
					...prev,
					[index]: targetPanelState,
					[index - 1]: currentPanelState
				}));

				setAnimatingItems({});
				// Force re-render to ensure all nested content updates
				// setRenderKey(prev => prev + 1);

				// Scroll to the moved item after animation and state update
				setTimeout(() => {
					scrollToItem(index - 1);
				}, 50);
			}, 300); // Animation duration
		}
	};

	// Move an item down in the order with animation
	const moveItemDown = (index) => {
		if (index < groupItems.length - 1) {
			// Save current panel states before move
			const currentPanelState = getPanelState(index);
			const targetPanelState = getPanelState(index + 1);

			// Set animation state
			setAnimatingItems({
				[index]: 'moving-down',
				[index + 1]: 'hide-not-moving'
			});

			// Clear any existing animation timeouts
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}

			// Wait for animation to complete before updating the state
			animationTimeoutRef.current = setTimeout(() => {
				if (!isMounted.current) return;

				setGroupItems(prevItems => {
					const newItems = deepClone(prevItems);
					const temp = newItems[index];
					newItems[index] = newItems[index + 1];
					newItems[index + 1] = temp;
					return newItems;
				});

				// Swap panel states to maintain open/close status
				setPanelStates(prev => ({
					...prev,
					[index]: targetPanelState,
					[index + 1]: currentPanelState
				}));

				setAnimatingItems({});
				// Force re-render to ensure all nested content updates
				// setRenderKey(prev => prev + 1);

				// Scroll to the moved item after animation and state update
				setTimeout(() => {
					scrollToItem(index + 1);
				}, 50);
			}, 300); // Animation duration
		}
	};

	// Scroll to a specific repeater item
	const scrollToItem = (itemIndex) => {
		// Use setTimeout to ensure DOM is updated
		setTimeout(() => {
			const repeaterItems = document.querySelectorAll('.native-custom-fields-repeater-item');
			if (repeaterItems[itemIndex]) {
				repeaterItems[itemIndex].scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}
		}, 100);
	};

	/**
	 * Handles the start of a drag operation
	 *
	 * @param {DragEvent} event The drag event
	 * @param {number} index Index of the item being dragged
	 */
	const handleDragStart = (event, index) => {
		// Set the dragged item index in state
		setDraggedItemIndex(index);

		// Set the drag effect to move
		event.dataTransfer.effectAllowed = 'move';

		// Try to pick an appropriate ghost image
		const container = (event.target && event.target.closest) ? (event.target.closest('.native-custom-fields-repeater-item') || event.currentTarget) : event.currentTarget;
		const ghostEl = container && container.querySelector ? (container.querySelector('.native-custom-fields-custom-panel-header') || container) : undefined;
		if (ghostEl && event.dataTransfer.setDragImage) {
			try {
				event.dataTransfer.setDragImage(ghostEl, 0, 0);
			} catch (e) {
			}
		}

		// Add a CSS class to the dragged item for visual feedback
		if (container && container.classList) {
			container.classList.add('native-custom-fields-repeater-item-dragging');
		} else if (event.target && event.target.classList) {
			event.target.classList.add('native-custom-fields-repeater-item-dragging');
		}

		// Add global dragover listener for auto-scroll (works everywhere, not just dropzones)
		globalDragOverHandlerRef.current = (e) => {
			handleAutoScroll(e);
		};
		document.addEventListener('dragover', globalDragOverHandlerRef.current);
	};

	/**
	 * Determines whether to show dropzone above or below based on mouse position
	 *
	 * @param {DragEvent} event The drag event
	 * @param {HTMLElement} element The element being dragged over
	 * @returns {'above'|'below'} The position to drop
	 */
	const getDropPosition = (event, element) => {
		const rect = element.getBoundingClientRect();
		const middleY = rect.top + rect.height / 2;

		return event.clientY < middleY ? 'above' : 'below';
	};

	/**
	 * Clears the auto-scroll interval
	 */
	const clearAutoScroll = () => {
		if (autoScrollIntervalRef.current) {
			clearInterval(autoScrollIntervalRef.current);
			autoScrollIntervalRef.current = null;
		}
	};

	/**
	 * Handles auto-scrolling when dragging near the edges
	 *
	 * @param {DragEvent} event The drag event
	 */
	const handleAutoScroll = (event) => {
		const scrollThreshold = 100; // pixels from edge to start scrolling
		const scrollSpeed = 10; // pixels per interval

		const viewportHeight = window.innerHeight;
		const mouseY = event.clientY;

		// Clear any existing auto-scroll
		clearAutoScroll();

		// Check if near top edge
		if (mouseY < scrollThreshold) {
			autoScrollIntervalRef.current = setInterval(() => {
				window.scrollBy({
					top: -scrollSpeed,
					behavior: 'auto'
				});
			}, 16); // ~60fps
		}
		// Check if near bottom edge
		else if (mouseY > viewportHeight - scrollThreshold) {
			autoScrollIntervalRef.current = setInterval(() => {
				window.scrollBy({
					top: scrollSpeed,
					behavior: 'auto'
				});
			}, 16); // ~60fps
		}
	};

	/**
	 * Handles the dragover event during a drag operation
	 *
	 * @param {DragEvent} event The drag event
	 * @param {number} index Index of the item being dragged over
	 */
	const handleDragOver = (event, index) => {
		// Prevent default to allow drop
		event.preventDefault();


		// Skip if dragging over the same item
		if (draggedItemIndex === index) {
			return;
		}

		// Set the drag over item index in state
		setDragOverItemIndex(index);

		// Find the repeater item container
		const current = event.currentTarget;
		const repeaterItem = (current && current.closest) ? current.closest('.native-custom-fields-repeater-item') : null;

		if (repeaterItem) {
			// Determine if we're dragging over the top or bottom half of the item
			const position = getDropPosition(event, repeaterItem);

			setDropPosition(position);

			// Clear existing dropzone indicators
			const items = document.querySelectorAll('.native-custom-fields-repeater-item');
			items.forEach(item => {
				item.classList.remove('native-custom-fields-repeater-item-dragover-above');
				item.classList.remove('native-custom-fields-repeater-item-dragover-below');
			});

			// Add visual indication for the drop target
			repeaterItem.classList.add(`native-custom-fields-repeater-item-dragover-${position}`);
		}
	};

	/**
	 * Handles the end of a drag operation
	 *
	 */
	const handleDragEnd = () => {
		// Clear auto-scroll interval
		clearAutoScroll();

		// Remove global dragover listener
		if (globalDragOverHandlerRef.current) {
			document.removeEventListener('dragover', globalDragOverHandlerRef.current);
			globalDragOverHandlerRef.current = null;
		}

		// Clean up CSS classes
		const items = document.querySelectorAll('.native-custom-fields-repeater-item');
		items.forEach(item => {
			item.classList.remove('native-custom-fields-repeater-item-dragging');
			item.classList.remove('native-custom-fields-repeater-item-dragover-above');
			item.classList.remove('native-custom-fields-repeater-item-dragover-below');
		});

		// Clean up header classes (panel layout)
		const headers = document.querySelectorAll('.native-custom-fields-custom-panel-header');
		headers.forEach(header => {
			header.classList.remove('native-custom-fields-repeater-item-dragging');
		});

		// Reorder items if we have valid source and target
		if (draggedItemIndex !== null && dragOverItemIndex !== null && draggedItemIndex !== dragOverItemIndex) {
			// First compute new order for items
			let insertPosition = dragOverItemIndex;
			if (dropPosition === 'below') {
				if (dragOverItemIndex < draggedItemIndex) {
					insertPosition += 1;
				}
			} else {
				if (dragOverItemIndex > draggedItemIndex) {
					insertPosition -= 1;
				}
			}
			// Bounds
			insertPosition = Math.max(0, Math.min(insertPosition, groupItems.length - 1));

			// Apply item reordering
			setGroupItems(prevItems => {
				const newItems = deepClone(prevItems);
				const draggedItem = newItems.splice(draggedItemIndex, 1)[0];
				newItems.splice(insertPosition, 0, draggedItem);
				return newItems;
			});

			// Apply the same reorder to panel states so open/close persists
			setPanelStates(prev => {
				const length = groupItems.length;
				const asArray = Array.from({ length }, (_, i) => (Object.prototype.hasOwnProperty.call(prev, i) ? prev[i] : !!initialOpen));
				const dragged = asArray.splice(draggedItemIndex, 1)[0];
				asArray.splice(insertPosition, 0, dragged);
				const updated = {};
				for (let i = 0; i < asArray.length; i++) {
					updated[i] = asArray[i];
				}
				return updated;
			});

			// Force re-render not required to persist state
			// setRenderKey(prev => prev + 1);
		}

		// Reset drag state
		setDraggedItemIndex(null);
		setDragOverItemIndex(null);
		setDropPosition(null);
	};

	const getRepeaterPanelOrderNumber = (index) => {
		return max > 1 ? `${index + 1})` : '';
	}

	// Handle panel toggle for individual items
	const handlePanelToggle = (index, isOpen) => {
		setPanelStates(prev => ({
			...prev,
			[index]: isOpen
		}));
	};

	// Get panel state for a specific index (fallback to initialOpen to keep it controlled)
	const getPanelState = (index) => {
		return Object.prototype.hasOwnProperty.call(panelStates, index) ? panelStates[index] : !!initialOpen;
	};

	// Build columns for table layout
	const tableColumns = modifiedFields.map(field => ({
		key: field.name,
		label: field.fieldLabel || field.name
	}));

	return (
		<>
			<div className={`native-custom-fields-repeater ${className}`}>
				{/* Panel Layout */}
				{layout === 'panel' && (
					<>
						{
							groupItems.length > 0 && (
								groupItems.map((item, index) => {

									// Pull panel title from the field flagged with setAsRepeaterItemTag (e.g., meta_box_title)
									const itemTagValue = getRepeaterItemTagValue(item, repeaterItemTagPath);
									const panelTitle = [getRepeaterPanelOrderNumber(index), itemTagValue].filter(Boolean).join(' ').trim();

									// Create action buttons for this repeater item
									const actionButtons = (
										<>
											{groupItems.length > 1 && (
												<>
													<Button
														isSmall
														variant="tertiary"
														disabled={index === 0 || !!animatingItems[index]}
														onClick={() => moveItemUp(index)}
														icon="arrow-up-alt2"
														aria-label={__('Move Up', 'native-custom-fields')}
													/>
													<Button
														isSmall
														variant="tertiary"
														disabled={index === groupItems.length - 1 || !!animatingItems[index]}
														onClick={() => moveItemDown(index)}
														icon="arrow-down-alt2"
														aria-label={__('Move Down', 'native-custom-fields')}
													/>
												</>
											)}
											{
												max !== 1 && (
													<>
														<Button
															isSmall
															variant="tertiary"
															disabled={groupItems.length >= max}
															onClick={() => copyItem(index)}
															icon={copy}
															aria-label={__('Copy Item', 'native-custom-fields')}
														/>
														<Button
															isSmall
															variant="tertiary"
															onClick={() => removeItem(index)}
															icon={trash}
															aria-label={__('Remove Item', 'native-custom-fields')}
														/>
													</>
												)
											}
										</>
									);

									return (
										<div
											key={`repeater-item-${name}-${index}`}
											className={`native-custom-fields-repeater-item ${animatingItems[index] || ''}`}
										>
											<CustomPanel
												title={panelTitle}
												icon={dragHandle}
												initialOpen={initialOpen}
												isOpen={getPanelState(index)}
												onToggle={(isOpen) => handlePanelToggle(index, isOpen)}
												actions={actionButtons}
												draggable={true}
												onDragStart={e => handleDragStart(e, index)}
												onDragEnd={handleDragEnd}
												onDragOver={e => handleDragOver(e, index)}
											>
												<div className="native-custom-fields-repeater-item-content">
													<RenderFields
														fields={modifiedFields}
														values={item}
														onChange={(fieldName, value) => handleItemChange(index, fieldName, value)}
														key={`fields-${name}-${index}-${renderKey}`}
													/>
												</div>
											</CustomPanel>
										</div>
									);
								})
							)
						}
					</>
				)}

				{/* Table Layout */}
				{layout === 'table' && (
					<>
						<div className="native-custom-fields-repeater-table-wrapper">
							<table className="native-custom-fields-repeater-table">
								<thead>
									<tr>
										<th className="native-custom-fields-repeater-col-order">#</th>
										{tableColumns.map(col => (
											<th key={`col-${name}-${col.key}`}>{col.label}</th>
										))}
										<th className="native-custom-fields-repeater-col-actions">{__('Actions', 'native-custom-fields')}</th>
									</tr>
								</thead>
								<tbody>
									{groupItems.length > 0 && groupItems.map((item, index) => {
										// Action buttons in table layout
										const actionButtons = (
											<div className="native-custom-fields-repeater-actions">
												{groupItems.length > 1 && (
													<>
														<Button
															isSmall
															variant="tertiary"
															disabled={index === 0 || !!animatingItems[index]}
															onClick={() => moveItemUp(index)}
															icon="arrow-up-alt2"
															aria-label={__('Move Up', 'native-custom-fields')}
														/>
														<Button
															isSmall
															variant="tertiary"
															disabled={index === groupItems.length - 1 || !!animatingItems[index]}
															onClick={() => moveItemDown(index)}
															icon="arrow-down-alt2"
															aria-label={__('Move Down', 'native-custom-fields')}
														/>
													</>
												)}
												{max !== 1 && (
													<>
														<Button
															isSmall
															variant="tertiary"
															disabled={groupItems.length >= max}
															onClick={() => copyItem(index)}
															icon={copy}
															aria-label={__('Copy Item', 'native-custom-fields')}
														/>
														<Button
															isSmall
															variant="tertiary"
															onClick={() => removeItem(index)}
															icon={trash}
															aria-label={__('Remove Item', 'native-custom-fields')}
														/>
													</>
												)}
											</div>
										);

										return (
											<tr
												key={`repeater-row-${name}-${index}-${renderKey}`}
												className={`native-custom-fields-repeater-item ${animatingItems[index] || ''}`}
												// draggable and dragStart moved to order cell to restrict drag handle
												onDragOver={e => handleDragOver(e, index)}
											>
												<td
													className="native-custom-fields-repeater-cell-order"
													draggable={true}
													onDragStart={e => handleDragStart(e, index)}
													onDragEnd={handleDragEnd}
													title={__('Drag to reorder', 'native-custom-fields')}
												>
													{index + 1}
												</td>
												{modifiedFields.map((field) => (
													<td key={`cell-${name}-${index}-${field.name}`} className={`native-custom-fields-repeater-cell native-custom-fields-repeater-cell-${field.name}`}>
														<RenderFields
															fields={[field]}
															values={item}
															onChange={(fieldName, value) => handleItemChange(index, fieldName, value)}
															key={`fields-${name}-${index}-${field.name}-${renderKey}`}
														/>
													</td>
												))}
												<td className="native-custom-fields-repeater-cell-actions">{actionButtons}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{groupItems.length < max && (
							<div className="native-custom-fields-repeater-add-new-button">
								<Button
									variant="secondary"
									onClick={addItem}
									icon={plus}
								>
									{addButtonText}
								</Button>
							</div>
						)}
					</>
				)}

				{/* Default add button for panel layout too */}
				{layout === 'panel' && groupItems.length < max && (
					<div className="native-custom-fields-repeater-add-new-button">
						<Button
							variant="secondary"
							onClick={addItem}
							icon={plus}
						>
							{addButtonText}
						</Button>
					</div>
				)}
			</div>
		</>
	);
};

export default RepeaterField;
