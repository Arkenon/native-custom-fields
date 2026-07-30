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
 * Validate required fields for meta (post/term/user meta forms)
 *
 * Delegates to getMissingRequiredFields so repeater and group fields are walked
 * recursively — a top-level-only check would miss a required field nested inside
 * a repeater item or group (see getMissingRequiredFields for details).
 *
 * @param {Array} fields - Field definitions
 * @param {Object} currentValues - Current field values
 * @returns {boolean} Whether all required fields are valid
 * @since 1.0.0
 */
export function validateFields(fields, currentValues) {
    return getMissingRequiredFields(currentValues, fields).length === 0;
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
        const missingFields = getMissingRequiredFields(sectionValues, sectionFields);

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
            fieldsBySection[sectionTitle].push(field.labelPath || field.fieldLabel);
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
 * Check whether a value counts as empty for required field validation
 * @param {any} value - The value to check
 * @returns {boolean} Whether the value is empty
 * @since 1.0.0
 */
function isEmptyFieldValue(value) {
    if (value === undefined || value === null) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    // Objects (box, border_box, border, etc.) need at least one non-empty entry
    if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 0) {
            return true;
        }

        return !keys.some(key => {
            const objVal = value[key];
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

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    return false;
}

/**
 * Get missing required fields recursively, walking into groups and repeater items
 *
 * Fields hidden by their own dependencies are skipped, mirroring how RenderFields and
 * GroupField decide what to render: a field the user cannot see must not block saving.
 *
 * @param {Object} values - The values for the current level (section, group or repeater item)
 * @param {Array} fields - The field definitions for the current level
 * @param {Array} labelPath - Parent labels used to build a readable error message
 * @returns {Array} Missing fields, each with a labelPath describing where it lives
 * @since 1.0.0
 */
export function getMissingRequiredFields(values, fields = [], labelPath = []) {
    let missingFields = [];

    if (!Array.isArray(fields) || fields.length === 0) {
        return missingFields;
    }

    const levelValues = (values && typeof values === 'object') ? values : {};

    for (const field of fields) {
        if (field.dependencies && !checkCondition(field.dependencies, levelValues)) {
            continue;
        }

        const fieldValue = levelValues[field.name];
        const fieldLabel = field.fieldLabel || field.name;
        const currentPath = [...labelPath, fieldLabel];

        // Handle both boolean true and string "1" for required field
        if ((field.required === true || field.required === "1") && isEmptyFieldValue(fieldValue)) {
            missingFields.push({...field, labelPath: currentPath.join(' > ')});
        }

        if (field.fieldType === 'repeater' && Array.isArray(fieldValue)) {
            fieldValue.forEach((item, index) => {
                missingFields = [
                    ...missingFields,
                    ...getMissingRequiredFields(item, field.fields, [...labelPath, `${fieldLabel} #${index + 1}`])
                ];
            });
        } else if (field.fieldType === 'group') {
            missingFields = [
                ...missingFields,
                ...getMissingRequiredFields(fieldValue, field.fields, currentPath)
            ];
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
 * Cast a value to a boolean for toggle/checkbox fields.
 *
 * The builder stores the "Default Value" as plain text and meta values come back from PHP
 * as strings, so "false" and "0" must not be treated as truthy the way `!!value` would.
 *
 * @param {any} value Value to cast
 * @returns {boolean} Boolean representation of the value
 * @since 1.3.3
 */
export function toBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return false;
    if (typeof value === 'number') return value !== 0;
    if (typeof value !== 'string') return !!value;

    const normalized = value.trim().toLowerCase();

    return !['', '0', 'false', 'off', 'no'].includes(normalized);
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
