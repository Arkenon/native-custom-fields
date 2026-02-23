/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {
    group,
    symbol,
    textColor,
    formatListNumbered,
    menu,
    check,
    listItem,
    code,
    button,
    brush,
    calendar,
    box,
    archive,
    layout,
    flipVertical,
    percent,
    upload,
    media,
    alignCenter,
    settings,
    info,
    lineSolid,
    formatBold,
    postList,
    people,
    category,
    cloudDownload,
} from '@wordpress/icons';

/**
 * Icon map for field/container types
 * @type {Object}
 * @since 1.0.0
 */
export const ICON_MAP = {
    section:          layout,
    meta_box:         box,
    group:            group,
    repeater:         symbol,
    input:            textColor,
    text:             textColor,
    number:           formatListNumbered,
    select:           menu,
    checkbox:         check,
    radio:            listItem,
    textarea:         code,
    range:            percent,
    toggle:           button,
    color_picker:     brush,
    color_palette:    brush,
    date_picker:      calendar,
    date_time_picker: calendar,
    time_picker:      calendar,
    unit:             settings,
    angle_picker:     flipVertical,
    alignment_matrix: alignCenter,
    border_box:       box,
    border:           archive,
    box:              box,
    toggle_group:     button,
    combobox:         menu,
    font_size:        formatBold,
    file_upload:      upload,
    media_library:    media,
    token_field:      listItem,
    external_link:    button,
    heading:          formatBold,
    notice:           info,
    text_highlight:   lineSolid,
};

/**
 * Icon map for dashboard items (uses camelCase keys from backend)
 * @type {Object}
 * @since 1.0.0
 */
export const DASHBOARD_ICON_MAP = {
    settings:      settings,
    postList:      postList,
    category:      category,
    people:        people,
    cloudDownload: cloudDownload,
};

/**
 * Attach icon objects to an array of type definitions using ICON_MAP
 * @param {Array} types
 * @returns {Array}
 * @since 1.0.0
 */
export const withIcons = ( types = [] ) =>
    types.map( ( type ) => ( { ...type, icon: ICON_MAP[ type.value ] ?? null } ) );

/**
 * Attach icon objects to an array of dashboard items using DASHBOARD_ICON_MAP
 * @param {Array} items
 * @returns {Array}
 * @since 1.0.0
 */
export const withDashboardIcons = ( items = [] ) =>
    items.map( ( item ) => ( { ...item, icon: DASHBOARD_ICON_MAP[ item.icon ] ?? null } ) );

/**
 * Validate required fields for meta (simple validation for post/term meta)
 * @param {Array} fields - Field definitions
 * @param {Object} currentValues - Current field values
 * @returns {boolean} Whether all required fields are valid
 * @since 1.0.0
 */
export function validateFields(fields, currentValues) {
    return fields.filter(f => f.required).every(f => {
        const val = currentValues[f.name];

        // Check if value exists
        if (!val) {
            return false;
        }

        // Check for arrays
        if (Array.isArray(val)) {
            return val.length > 0;
        }

        // Check for objects (box, border_box, border, etc.)
        if (typeof val === 'object' && val !== null) {
            const keys = Object.keys(val);
            if (keys.length === 0) {
                return false;
            }

            // Check if at least one value in the object is non-empty
            return keys.some(key => {
                const objVal = val[key];
                if (objVal === null || objVal === undefined || objVal === '') {
                    return false;
                }
                if (typeof objVal === 'string') {
                    return objVal.trim() !== '';
                }
                if (Array.isArray(objVal)) {
                    return objVal.length > 0;
                }
                if (typeof objVal === 'object') {
                    return Object.keys(objVal).length > 0;
                }
                return true; // for numbers, booleans, etc.
            });
        }

        // Check for strings and other primitives
        return val.toString().trim() !== '';
    });
}

/**
 * Validate required fields for all sections
 * @param {Array} sections - All sections with their fields
 * @param {Object} allValues - All form values (all sections)
 * @returns {Object}
 * @since 1.0.0
 */
export function validateRequiredFields(sections, allValues) {
    let allMissingFields = [];

    // Check each section for missing required fields
    sections.forEach(section => {
        const sectionName = section.section_name;
        const sectionFields = section.fields || [];
        const sectionValues = allValues[sectionName] || {};

        // Get missing fields for this section
        const missingFields = getMissingFields(sectionValues, sectionFields);

        // Add section info to missing fields for better error messages
        const missingFieldsWithSection = missingFields.map(field => ({
            ...field,
            sectionName: section.section_name,
            sectionTitle: section.section_title
        }));

        allMissingFields = [...allMissingFields, ...missingFieldsWithSection];
    });

    if (allMissingFields.length > 0) {
        // Group missing fields by section for better error message
        const fieldsBySection = {};
        allMissingFields.forEach(field => {
            const sectionTitle = field.sectionTitle || field.sectionName;
            if (!fieldsBySection[sectionTitle]) {
                fieldsBySection[sectionTitle] = [];
            }
            fieldsBySection[sectionTitle].push(field.fieldLabel);
        });

        // Create detailed error message with HTML line breaks
        const errorMessages = Object.keys(fieldsBySection).map(sectionTitle => {
            const fieldLabels = fieldsBySection[sectionTitle].join(', ');
            return `${sectionTitle}: ${fieldLabels}`;
        });

        return {
            isValid: false,
            message: __('Please fill in all required fields:', 'native-custom-fields') + '<br><br>' + errorMessages.join('<br>')
        };
    } else {
        return {isValid: true};
    }
}

/**
 * Get missing fields recursively
 * @param {Object} values - The form values
 * @param {Array} fields - The fields to check
 * @returns {Array} Missing fields
 */
function getMissingFields(values, fields = []) {
    let missingFields = [];

    if (!fields || fields.length === 0) {
        return missingFields;
    }

    // Process each field in the current level
    for (const field of fields) {
        const fieldName = field.name;

        // Get the field value from the form values
        const fieldValue = values[fieldName];

        // Check if this field is required and empty
        // Handle both boolean true and string "1" for required field
        if (field.required === true || field.required === "1") {
            let isEmpty = false;

            if (fieldValue === undefined || fieldValue === null) {
                isEmpty = true;
            }
            // Check for arrays
            else if (Array.isArray(fieldValue)) {
                isEmpty = fieldValue.length === 0;
            }
            // Check for objects (box, border_box, border, etc.)
            else if (typeof fieldValue === 'object' && fieldValue !== null) {
                const keys = Object.keys(fieldValue);
                if (keys.length === 0) {
                    isEmpty = true;
                } else {
                    // Check if at least one value in the object is non-empty
                    const hasValidValue = keys.some(key => {
                        const objVal = fieldValue[key];
                        if (objVal === null || objVal === undefined || objVal === '') {
                            return false;
                        }
                        if (typeof objVal === 'string') {
                            return objVal.trim() !== '';
                        }
                        if (Array.isArray(objVal)) {
                            return objVal.length > 0;
                        }
                        if (typeof objVal === 'object') {
                            return Object.keys(objVal).length > 0;
                        }
                        return true; // for numbers, booleans, etc.
                    });
                    isEmpty = !hasValidValue;
                }
            }
            // Check for strings and other primitives
            else if (typeof fieldValue === 'string') {
                isEmpty = fieldValue.trim() === '';
            }

            if (isEmpty) {
                missingFields.push(field);
            }
        }

        // Handle repeater fields (array of objects)
        if (field.fieldType === 'repeater' && Array.isArray(fieldValue) && fieldValue.length > 0) {

            // Check each item in the repeater
            fieldValue.forEach((item, index) => {

                // Process nested fields inside this repeater item
                const itemMissingFields = processNestedItem(item, field.fields);

                if (itemMissingFields.length > 0) {
                    missingFields = [...missingFields, ...itemMissingFields];
                }
            });
        }

        // Handle group fields (object with nested fields)
        else if (field.fieldType === 'group' && fieldValue) {
            // Process nested fields inside this group
            const groupMissingFields = processNestedItem(fieldValue, field.fields);

            if (groupMissingFields.length > 0) {
                missingFields = [...missingFields, ...groupMissingFields];
            }
        }
    }

    return missingFields;
}

/**
 * Process a nested item (used for both repeater items and groups)
 * @param {Object} item - The nested item object
 * @param {Array} fields - The fields definition
 * @returns {Array} Missing fields
 */
function processNestedItem(item, fields) {
    let missingFields = [];

    if (!fields || fields.length === 0) {
        return missingFields;
    }

    // Process each field in the nested structure
    for (const field of fields) {
        const fieldName = field.name;

        let fieldValue;

        if (item[fieldName] !== null && item[fieldName] !== undefined) {
            fieldValue = item[fieldName];
        }

        // Check if required and empty
        // Handle both boolean true and string "1" for required field
        if (field.required === true || field.required === "1") {
            let isEmpty = false;

            if (fieldValue === undefined || fieldValue === null) {
                isEmpty = true;
            }
            // Check for arrays
            else if (Array.isArray(fieldValue)) {
                isEmpty = fieldValue.length === 0;
            }
            // Check for objects (box, border_box, border, etc.)
            else if (typeof fieldValue === 'object' && fieldValue !== null) {
                const keys = Object.keys(fieldValue);
                if (keys.length === 0) {
                    isEmpty = true;
                } else {
                    // Check if at least one value in the object is non-empty
                    const hasValidValue = keys.some(key => {
                        const objVal = fieldValue[key];
                        if (objVal === null || objVal === undefined || objVal === '') {
                            return false;
                        }
                        if (typeof objVal === 'string') {
                            return objVal.trim() !== '';
                        }
                        if (Array.isArray(objVal)) {
                            return objVal.length > 0;
                        }
                        if (typeof objVal === 'object') {
                            return Object.keys(objVal).length > 0;
                        }
                        return true; // for numbers, booleans, etc.
                    });
                    isEmpty = !hasValidValue;
                }
            }
            // Check for strings and other primitives
            else if (typeof fieldValue === 'string') {
                isEmpty = fieldValue.trim() === '';
            }

            if (isEmpty) {
                missingFields.push(field);
            }
        }

        // Handle nested repeaters
        if (field.fieldType === 'repeater' && Array.isArray(fieldValue) && fieldValue.length > 0) {

            fieldValue.forEach((subItem, index) => {
                const subItemMissingFields = processNestedItem(subItem, field.fields);
                missingFields = [...missingFields, ...subItemMissingFields];
            });
        }

        // Handle nested groups
        else if (field.fieldType === 'group' && fieldValue) {

            const nestedGroupMissingFields = processNestedItem(fieldValue, field.fields);
            missingFields = [...missingFields, ...nestedGroupMissingFields];
        }
    }

    return missingFields;
}

/**
 * Fields that already have input tag (no hidden input needed)
 * Should match the PHP Helper::fieldsAlreadyHaveInput() method
 * @returns {Array<string>} Field types
 * @since 1.0.0
 */
export function fieldsAlreadyHaveInput() {
    return ['text', 'textarea', 'number', 'input', 'range', 'combobox'];
}

/**
 * Update hidden input value
 * @param {string} name Field name
 * @param {any} value Field value
 * @param {HTMLInputElement} input Hidden input element
 * @param {string} fieldType Field type (optional)
 * @returns {void}
 * @since 1.0.0
 */
export function updateHiddenInputValue(name, value, input, fieldType = '') {
    try {
        // Skip warning for fields that already have their own input
        if (!input) {
            if (!fieldType || !fieldsAlreadyHaveInput().includes(fieldType)) {
                console.warn(`Hidden input for ${name} not found in any metabox`);
            }
            return;
        }

        // Set the value based on type
        if (value === null || value === undefined) {
            input.value = '';
        } else if (typeof value === 'boolean') {
            // Convert boolean to string: true -> "1", false -> "" (empty for proper PHP falsy evaluation)
            input.value = value ? '1' : '';
        } else if (typeof value === 'object') {
            // Handle both arrays and objects
            input.value = JSON.stringify(value);
        } else {
            input.value = String(value);
        }
    } catch (error) {
        console.error('Error updating hidden input:', error, {name, value});
    }
}

/**
 * Copy text to clipboard
 * @param text
 * @returns {Promise<*|boolean|boolean>}
 * @since 1.0.0
 */
export async function copyToClipboard(text) {
    // Modern Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        return true;
    }

    // Fallback for WP Admin / insecure context
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
    } catch (err) {
        document.body.removeChild(textarea);
        return false;
    }
}


/**
 * Log error when no field configuration is found
 * @param {any} defaultValue Default value to return
 * @param  {string} fieldType
 * @returns {any} Default value or null if not defined
 * @since 1.0.0
 */
export function getDefaultValue(defaultValue, fieldType) {
    if (defaultValue === undefined) {
        // BorderBoxControl requires an object with top, right, bottom, left properties
        if (fieldType === 'border_box') {
            return {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            };
        }
        // BoxControl requires an object with top, right, bottom, left properties (with units)
        if (fieldType === 'box') {
            return {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            };
        }
        return null;
    }

    if (typeof defaultValue !== 'string') return defaultValue;

    // Convert boolean strings to actual booleans (case-insensitive)
    const lowerValue = defaultValue.toLowerCase().trim();
    if (lowerValue === 'true') return true;
    if (lowerValue === 'false') return false;

    // DatePicker: YYYY-MM-DD
    if (fieldType === 'date_picker') {
        const m = defaultValue.match(/^(\d{4}-\d{2}-\d{2})/);
        if (m) return m[1];

        try {
            const d = new Date(defaultValue);
            if (!isNaN(d)) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            }
        } catch (_) {
        }
        return defaultValue;
    }

    // DateTimePicker: YYYY-MM-DDTHH:mm:ss
    if (fieldType === 'date_time_picker') {

        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(defaultValue)) {
            return `${defaultValue}:00`;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(defaultValue)) {
            return `${defaultValue}T00:00:00`;
        }

        try {
            const d = new Date(defaultValue);
            if (!isNaN(d)) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const hh = String(d.getHours()).padStart(2, '0');
                const mi = String(d.getMinutes()).padStart(2, '0');
                const ss = String(d.getSeconds()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
            }
        } catch (_) {
        }

        return defaultValue;
    }

    return defaultValue;
}

/**
 * Log error when no field configuration is found
 * @returns {void}
 * @since 1.0.0
 */
export function noFieldConfigurationFound() {
    console.error(__('No fields configuration found', 'native-custom-fields'));
}

/**
 * Log error when initializing fields
 * @param {Object} error
 * @returns {void}
 * @since 1.0.0
 */
export function fieldInitializationError(error) {
    console.error(__('Error initializing fields:', 'native-custom-fields'), error.message);
}

/**
 * Check if field should be visible based on condition
 *
 * @param {Object} dependencies Condition object
 * @param {Object} values Form values
 * @returns {boolean} Whether field should be visible
 * @since 1.0.0
 */
export function checkCondition(dependencies, values) {
    // If there is no dependency, the conditions array is empty, or values is missing, accept as visible/valid.
    if (!dependencies || !Array.isArray(dependencies.conditions) || dependencies.conditions.length === 0) {
        return true;
    }

    const {relation = 'and', conditions} = dependencies; // If relation is not specified, default is 'and'.

    if (relation === 'or') {
        // 'or' relation: At least one of the conditions must be true.
        // Array.prototype.some() is ideal for this.
        return conditions.some(condition => evaluateSingleCondition(condition, values));
    }

    // 'and' relation (or undefined): All conditions must be true.
    // Array.prototype.every() is ideal for this.
    return conditions.every(condition => evaluateSingleCondition(condition, values));
}

export function evaluateSingleCondition(condition, values) {
    if (!condition || !condition.field || !condition.operator || !values) {
        return true;
    }

    // First check if the value exists directly
    let fieldValue = values[condition.field];

    // If not found directly, search for it in sections
    if (fieldValue === undefined) {
        for (const sectionName in values) {
            if (
                values[sectionName] &&
                typeof values[sectionName] === 'object' &&
                values[sectionName].hasOwnProperty(condition.field)
            ) {
                fieldValue = values[sectionName][condition.field];
                break;
            }
        }
    }

    // If the value is still not found, accept it as undefined
    if (fieldValue === undefined) {
        fieldValue = undefined;
    }

    const compareValue = condition.value;

    // Normalize boolean values for comparison
    const normalizeBooleanValue = (value) => {
        // Handle boolean values stored as strings or numbers
        if (value === "true" || value === "1" || value === 1) return true;
        if (value === "false" || value === "0" || value === 0) return false;
        return value;
    };

    // Normalize both values for comparison
    const normalizedFieldValue = normalizeBooleanValue(fieldValue);
    const normalizedCompareValue = normalizeBooleanValue(compareValue);

    switch (condition.operator) {
        case '==':
            // Use loose equality for different types but same value
            return normalizedFieldValue == normalizedCompareValue;
        case '!=':
            // Use loose inequality for different types but same value
            return normalizedFieldValue != normalizedCompareValue;
        case '===':
            // Use strict equality for exact match
            return normalizedFieldValue === normalizedCompareValue;
        case '!==':
            // Use strict inequality for exact mismatch
            return normalizedFieldValue !== normalizedCompareValue;
        case '>':
            // Greater than comparison
            const gt1 = parseFloat(fieldValue), gt2 = parseFloat(compareValue);
            return !isNaN(gt1) && !isNaN(gt2) && gt1 > gt2;
        case '<':
            // Less than comparison
            const lt1 = parseFloat(fieldValue), lt2 = parseFloat(compareValue);
            return !isNaN(lt1) && !isNaN(lt2) && lt1 < lt2;
        case '>=':
            // Greater than or equal to comparison
            const gte1 = parseFloat(fieldValue), gte2 = parseFloat(compareValue);
            return !isNaN(gte1) && !isNaN(gte2) && gte1 >= gte2;
        case '<=':
            // Less than or equal to comparison
            const lte1 = parseFloat(fieldValue), lte2 = parseFloat(compareValue);
            return !isNaN(lte1) && !isNaN(lte2) && lte1 <= lte2;
        default:
            return true;
    }
}

/**
 * Clone object deeply
 *
 * @param {any} obj object to clone
 * @returns {any} cloned object (can be an object, array, or primitive value)
 * @since 1.0.0
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }

    const clonedObj = {};
    Object.keys(obj).forEach(key => {
        clonedObj[key] = deepClone(obj[key]);
    });

    return clonedObj;
}

/**
 * Create an empty item with default values for each field
 * @param fields
 * @returns {Object} Empty item with default values for each field
 * @since 1.0.0
 */
export function createEmptyItem(fields) {
    // Initialize with empty values for each field
    const emptyItem = {};

    // For each field in the fields array, initialize with an appropriate empty value
    if (fields && Array.isArray(fields)) {
        fields.forEach(field => {
            if (field.name) {
                // For nested repeaters, initialize with an empty array
                if (field.fieldType === 'repeater') {
                    emptyItem[field.name] = [];
                }
                // For nested groups, initialize with an empty object and populate nested fields
                else if (field.fieldType === 'group' && field.fields) {
                    emptyItem[field.name] = createEmptyItem(field.fields);
                }
                // For boolean fields (toggle, checkbox), set proper default values
                else if (field.fieldType === 'toggle' || field.fieldType === 'checkbox') {
                    // Set default value if provided, otherwise false for boolean fields
                    emptyItem[field.name] = field.default !== undefined ? field.default : false;
                }
                // For other field types, initialize with empty string or appropriate default
                else {
                    // Set default value if provided, otherwise empty string
                    emptyItem[field.name] = field.default !== undefined ? field.default : '';
                }

                // Override with explicit default value if provided (this handles any field type)
                if (field.default !== undefined) {
                    emptyItem[field.name] = field.default;
                }
            }
        });
    }

    return emptyItem;
}

/**
 * Parse JSON parameter from string to array
 * Used by BorderControl, BorderBoxControl, FontSizePicker, etc.
 *
 * @param {string|Array} jsonData JSON parameter (JSON string or array)
 * @param {string} fieldType Field type for error messaging
 * @returns {Array|undefined} Parsed array or undefined
 * @since 1.0.0
 */
export function parseJsonArray(jsonData, fieldType = 'field') {
    if (!jsonData) {
        return undefined;
    }

    try {
        if (typeof jsonData === 'string') {
            return JSON.parse(jsonData);
        } else if (Array.isArray(jsonData)) {
            return jsonData;
        }
    } catch (e) {
        console.warn(`Invalid JSON format for parameter in ${fieldType}:`, e);
    }

    return undefined;
}
