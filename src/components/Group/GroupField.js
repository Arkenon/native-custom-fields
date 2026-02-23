import {useEffect, useState, useRef, useCallback} from '@wordpress/element';
import {__experimentalGrid as Grid, Flex, FlexItem} from '@wordpress/components';
import {CustomPanel} from "@nativecustomfields/components/index.js";
import {checkCondition, createEmptyItem, deepClone, getDefaultValue} from "@nativecustomfields/common/helper.js";
import RenderSingleField from "@nativecustomfields/render/RenderSingleField.js";

/**
 * Renders a group of fields as a single object
 *
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {string} props.name Field name
 * @param {Array} props.fields Fields to render inside the group
 * @param {Object} props.values Form values object
 * @param {Function} props.onChange Value change handler
 * @param {string} [props.className=''] Additional CSS class names
 * @param {string} [props.layout='flex'] Whether to use Grid or Flex layout
 * @param {Array | String} [props.direction=['column', 'row']] or [props.direction='column'] Flexbox direction
 * @returns {React.ReactElement} Group field component
 */
const GroupField = (
	{
		name,
		layout = 'flex',
		fields,
		values = {},
		onChange,
		className = '',
		direction,
		justify = 'space-between',
		align = 'top',
		gap = 4,
		columns = 3
	}) => {

	const [flexDirection, setFlexDirection] = useState(['column', 'row']);

	useEffect(
		() => {
			if (direction === 'row') {
				setFlexDirection(['row']);
			} else if (direction === 'column') {
				setFlexDirection(['column']);
			}
		}, [direction]
	)

	// State to manage group data
	const [groupData, setGroupData] = useState({});
	const prevValuesRef = useRef();
	const isFirstRender = useRef(true);

	// Helper: deep compare objects
	const deepEqual = (obj1, obj2) => {
		if (obj1 === obj2) return true;
		if (obj1 == null || obj2 == null) return false;
		if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;

		// Handle arrays
		if (Array.isArray(obj1) && Array.isArray(obj2)) {
			if (obj1.length !== obj2.length) return false;
			for (let i = 0; i < obj1.length; i++) {
				if (!deepEqual(obj1[i], obj2[i])) return false;
			}
			return true;
		}

		// One is array, other is not
		if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) return false;

		for (let key of keys1) {
			if (!keys2.includes(key)) return false;
			if (!deepEqual(obj1[key], obj2[key])) return false;
		}

		return true;
	};

	// Helper: apply defaults for missing keys without mutating input
	const applyDefaults = (data, fieldsDef) => {
		const base = (data && typeof data === 'object' && !Array.isArray(data)) ? deepClone(data) : {};
		if (Array.isArray(fieldsDef)) {
			fieldsDef.forEach(field => {
				const key = field.name;
				if (!key) return;

				// If key is missing or undefined, set a sensible default
				if (base[key] === undefined || base[key] === null) {
					if (field.fieldType === 'group' && Array.isArray(field.fields)) {
						base[key] = applyDefaults({}, field.fields);
					} else if (field.fieldType === 'repeater') {
						base[key] = Array.isArray(field.default) ? deepClone(field.default) : [];
					} else if (field.fieldType === 'toggle' || field.fieldType === 'checkbox') {
						base[key] = field.default !== undefined ? field.default : false;
					} else {
						base[key] = getDefaultValue(field.default, field.fieldType);
					}
				} else {
					// If key exists and is nested, ensure nested defaults are applied
					if (field.fieldType === 'group' && Array.isArray(field.fields) && typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
						base[key] = applyDefaults(base[key], field.fields);
					}
				}
			});
		}
		return base;
	};

	// Sync groupData when values prop changes
	useEffect(() => {
		// On first render, always initialize
		if (isFirstRender.current) {
			isFirstRender.current = false;

			let initialData;
			if (values && typeof values === 'object' && !Array.isArray(values) && Object.keys(values).length > 0) {
				initialData = applyDefaults(values, fields);
			} else if (fields && Array.isArray(fields)) {
				initialData = createEmptyItem(fields);
			} else {
				initialData = {};
			}

			prevValuesRef.current = values;
			setGroupData(initialData);
			return;
		}

		// Check if values actually changed using deep comparison
		const valuesChanged = !deepEqual(prevValuesRef.current, values);

		if (valuesChanged) {
			let newData;
			if (values && typeof values === 'object' && !Array.isArray(values) && Object.keys(values).length > 0) {
				// Use incoming values and apply defaults for missing fields
				newData = applyDefaults(values, fields);
			} else if (fields && Array.isArray(fields)) {
				// No values provided, create empty structure with defaults
				newData = createEmptyItem(fields);
			} else {
				newData = {};
			}

			prevValuesRef.current = values;
			setGroupData(newData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values]); // Removed fields from dependency array - it rarely changes and causes unnecessary re-renders

	// Handle individual field change within the group
	const handleFieldChange = useCallback((fieldName, fieldValue) => {
		setGroupData(prevData => {
			const updatedData = {
				...prevData,
				[fieldName]: fieldValue
			};


			// Notify parent of the change
			if (onChange) {
				onChange(name, updatedData);
			}

			return updatedData;
		});
	}, [name, onChange]); // Removed groupData - not needed because we use setGroupData callback

	const renderGroupFields = (fields) => {
		return fields.map((field, index) => {
			const key = field.name || field.fieldLabel || index;

			// Do not mutate original field; create a shallow copy with hasParent
			const fieldWithParent = {...field, hasParent: true};

			// Check condition before rendering field - use groupData instead of values
			if (fieldWithParent.dependencies && !checkCondition(fieldWithParent.dependencies, groupData)) {
				return null;
			}

			return (
				<FlexItem className='components-flex-item-custom-width-100' key={`flex-item-${index}`}>
					<div
						key={`field-${key}`}
						className={`native-custom-fields-field ${fieldWithParent.className || ''}`}
					>
						{RenderSingleField ? (
							<RenderSingleField
								{...fieldWithParent}
								values={groupData}
								onChange={handleFieldChange}
							/>
						) : null}
					</div>
				</FlexItem>
			)
		});
	}


	return (
		<div className={`native-custom-fields-group ${className}`}>
			<div className="native-custom-fields-group-item">
				<CustomPanel
					hasHeader={false}
				>
					<div className="native-custom-fields-group-item-content">
						{
							layout === 'grid' ? (
									<Grid
										columns={columns}
										justify={justify}
										align={align}
										gap={gap}
									>
										{renderGroupFields(fields)}
									</Grid>

								) :
								(
									<Flex
										direction={flexDirection}
										justify={justify}
										align={align}
										gap={gap}
									>
										{renderGroupFields(fields)}
									</Flex>
								)
						}
					</div>
				</CustomPanel>
			</div>
		</div>
	);
};

export default GroupField;
