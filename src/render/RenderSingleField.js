/**
 * RenderSingleField Component
 *
 * Renders a single form field based on the provided configuration.
 * @version 1.0.0
 * @package native-custom-fields
 */


/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {Icon} from '@wordpress/components';
import * as icons from '@wordpress/icons';
import {
    TextControl,
    SelectControl,
    RadioControl,
    TextareaControl,
    Button,
    BaseControl,
    CheckboxControl,
    RangeControl,
    ToggleControl,
    ColorPicker,
    DatePicker,
    DateTimePicker,
    TimePicker,
    __experimentalNumberControl as NumberControl,
    __experimentalInputControl as InputControl,
    __experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
    __experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
    __experimentalUnitControl as UnitControl,
    AnglePickerControl,
    __experimentalAlignmentMatrixControl as AlignmentMatrixControl,
    __experimentalBorderBoxControl as BorderBoxControl,
    __experimentalBorderControl as BorderControl,
    __experimentalBoxControl as BoxControl,
    ColorPalette,
    ExternalLink,
    FontSizePicker,
    FormTokenField,
    __experimentalHeading as Heading,
    Notice,
    TextHighlight,
    Flex,
    FlexItem,
    VisuallyHidden
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {ComboboxField, FileUploadField, MediaLibraryField, RepeaterField} from '@nativecustomfields/components';
import GroupField from "@nativecustomfields/components/Group/GroupField.js";
import {getDefaultValue, parseJsonArray} from "@nativecustomfields/common/helper.js";
import {
    isDynamicOptionsString,
    parseStaticOptionsString,
    useDynamicOptions
} from "@nativecustomfields/common/optionsHelper.js";
import ToggleGroupField from "@nativecustomfields/components/ToggleGroup/ToggleGroupField.js";

/**
 * Render a single field based on type
 *
 * @version 1.0.0
 * @param {Object} props Element configuration
 * @param {string} [props.fieldType] Field type
 * @param {string} [props.inputType] Input type for text fields
 * @param {string} [props.name] Field name
 * @param {string|Array|Object} [props.options] Options for select, radio, toggle_group, combobox, etc.
 * @param {string} [props.fieldLabel] Field label
 * @param {string} [props.fieldHelpText] Field help text
 * @param {string} [props.fieldLabelPosition='top'] Field label position ('top' or 'side')
 * @param {boolean} [props.hideLabel=false] Whether to hide the label
 * @param {string} [props.fieldLabelTextTransform='uppercase'] Text transform for label ('uppercase', 'lowercase', 'capitalize')
 * @param {Object} [props.values] Form values
 * @param {Function} [props.onChange] Value change handler
 * @returns {React.ReactElement} Form element
 */
const RenderSingleField = (props) => {

    // Validate props
    if (!props || typeof props !== 'object') {
        return null;
    }

    //Extract properties to be used for BaseControl
    const {
        fieldType,
        inputType,
        values,
        onChange,
        name,
        options, //For select, radio, toggle_group, combobox, etc.
        fieldLabel,
        fieldHelpText,
        fieldLabelPosition = 'top', // Default label position
        hideLabel = false,
        fieldLabelTextTransform = 'uppercase', // Default label text transform
        ...elementProps
    } = props;

    // Remove label and help from elementProps to prevent duplication
    const {label, help, ...restElementProps} = elementProps;
    const handleChange = (value) => {
        // Allow undefined values for reset operations (e.g., FontSizePicker reset button)
        // Only check if onChange exists and name is defined
        if (onChange && name) {
            onChange(name, value);
        }
    };


    let defaultValue = restElementProps.default;
    let currentValue = '';

    currentValue = getDefaultValue(defaultValue, fieldType);

    if (name && values) {
        // First, try to get from flat values
        if (values.hasOwnProperty(name)) {
            currentValue = values[name];
        }
        // Then try to get from grouped values
        else {
            for (const field in values) {
                if (values[field] && values[field].hasOwnProperty(name)) {
                    currentValue = values[field][name];
                    break;
                }
            }
        }
    }

    const className = `${restElementProps.className || ''}`.trim();

    // Resolve options (static string, dynamic string, or array)
    const optionsInput = (typeof options !== 'undefined') ? options : restElementProps.options;
    const dynamic = isDynamicOptionsString(optionsInput);
    const {options: dynamicOptions} = useDynamicOptions(dynamic ? optionsInput : null);
    const staticOptions = !dynamic
        ? (typeof optionsInput === 'string'
            ? parseStaticOptionsString(optionsInput)
            : Array.isArray(optionsInput)
                ? optionsInput
                : [])
        : [];
    const resolvedOptions = dynamic ? (dynamicOptions || []) : staticOptions;
    const selectedOption = resolvedOptions.find(opt => String(opt.value) === String(currentValue));
    // Resolve marks for range control (similar to options but for marks prop)
    const marksInput = restElementProps.marks;
    const resolvedMarks = (typeof marksInput === 'string')
        ? parseStaticOptionsString(marksInput).map(item => ({
            value: parseFloat(item.value) || 0,
            label: item.label
        }))
        : Array.isArray(marksInput)
            ? marksInput
            : undefined;

    // Helper: resolve a WordPress icon object from an icon name string
    const getIconFromName = (value) => {
        if (typeof value !== 'string') return null;
        if (icons[value]) return icons[value];
        const lowerValue = value.toLowerCase();
        if (icons[lowerValue]) return icons[lowerValue];
        const camelValue = value.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (icons[camelValue]) return icons[camelValue];
        return null;
    };

    // Helper: returns true when the string looks like an icon name (camelCase / kebab-case)
    const looksLikeIconName = (value) => {
        if (typeof value !== 'string' || !value) return false;
        return /^[a-z][a-zA-Z-]*$/.test(value);
    };

    // Helper: build a prefix React element from a raw string value
    const buildPrefixElement = (value, WrapperComponent) => {
        if (!value) return undefined;
        const iconObj = getIconFromName(value);
        if (iconObj) {
            return (
                <WrapperComponent variant="icon">
                    <Icon icon={iconObj}/>
                </WrapperComponent>
            );
        }
        if (!looksLikeIconName(value)) {
            return (
                <WrapperComponent variant="default">
                    {value}
                </WrapperComponent>
            );
        }
        // Looks like an icon name but not found – render nothing
        return undefined;
    };

    // Helper: build a suffix React element from a raw string value
    const buildSuffixElement = (value, WrapperComponent) => {
        if (!value) return undefined;
        const iconObj = getIconFromName(value);
        if (iconObj) {
            return (
                <WrapperComponent variant="icon">
                    <Icon icon={iconObj}/>
                </WrapperComponent>
            );
        }
        if (!looksLikeIconName(value)) {
            return (
                <WrapperComponent variant="default">
                    {value}
                </WrapperComponent>
            );
        }
        return undefined;
    };

    // Resolve suggestions for token field (convert comma-separated string to array)
    const suggestionsInput = restElementProps.suggestions;
    const resolvedSuggestions = (typeof suggestionsInput === 'string')
        ? suggestionsInput
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : Array.isArray(suggestionsInput)
            ? suggestionsInput
            : undefined;

    // Email and URL validation functions
    const isValidEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    const isValidUrl = (value) => {
        if (typeof value !== 'string' || !value.trim()) return false;
        try {
            const parsed = new URL(value);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    // Render the field component based on type
    const renderField = () => {
        switch (fieldType) {
            case 'text': {
                const isEmailType = inputType === 'email';
                const isUrlType = inputType === 'url';
                const hasValue = typeof currentValue === 'string' && currentValue.trim() !== '';
                const isEmailInvalid = isEmailType && hasValue && !isValidEmail(currentValue);
                const isUrlInvalid = isUrlType && hasValue && !isValidUrl(currentValue);
                const validationHelp = isEmailInvalid
                    ? __('Please enter a valid email address.', 'native-custom-fields')
                    : isUrlInvalid
                        ? __('Please enter a valid URL.', 'native-custom-fields')
                        : restElementProps.help;
                const validationClassName = `${className} ${(isEmailInvalid || isUrlInvalid) ? 'native-custom-fields-has-validation-error' : ''}`.trim();

                return (<TextControl
                    {...restElementProps}
                    type={inputType || 'text'}
                    help={validationHelp}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={validationClassName}
                    name={name}
                    value={currentValue}
                    onChange={handleChange}
                />);
            }
            case 'number':
                return (<NumberControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue}
                    onChange={handleChange}
                />);
            case 'input': {
                // Remove prefix and suffix from restElementProps to avoid duplication
                const {prefix, suffix, ...inputControlProps} = restElementProps;

                return (<InputControl
                    {...inputControlProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue}
                    prefix={buildPrefixElement(prefix, InputControlPrefixWrapper)}
                    suffix={buildSuffixElement(suffix, InputControlSuffixWrapper)}
                    onChange={handleChange}
                />);
            }
            case 'select': {
                const {prefix, suffix, ...selectControlProps} = restElementProps;
                const selectOptions = [{
                    label: __('Select...', 'native-custom-fields'),
                    value: null
                }].concat(resolvedOptions);
                return (<SelectControl
                    {...selectControlProps}
                    options={selectOptions}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue}
                    prefix={buildPrefixElement(prefix, InputControlPrefixWrapper)}
                    suffix={buildSuffixElement(suffix, InputControlSuffixWrapper)}
                    onChange={handleChange}
                />);
            }
            case 'checkbox':
                return (<CheckboxControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    className={className}
                    name={name}
                    checked={!!currentValue}
                    onChange={handleChange}
                />);
            case 'radio':
                return (<RadioControl
                    {...restElementProps}
                    options={[...resolvedOptions]}
                    className={className}
                    name={name}
                    selected={currentValue}
                    onChange={handleChange}
                />);
            case 'textarea':
                return (<TextareaControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    className={className}
                    name={name}
                    value={currentValue}
                    onChange={handleChange}
                />);
            case 'range':
                return (<RangeControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue ? parseInt(currentValue) : 0}
                    marks={resolvedMarks}
                    onChange={handleChange}
                />);
            case 'toggle':
                return (<ToggleControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    className={className}
                    name={name}
                    checked={!!currentValue}
                    onChange={handleChange}
                />);
            case 'color_picker':
                return (<ColorPicker
                    {...restElementProps}
                    className={className}
                    name={name}
                    color={currentValue}
                    onChange={handleChange}
                />);
            case 'date_picker':
                return (<DatePicker
                    {...restElementProps}
                    className={className}
                    name={name}
                    currentDate={currentValue}
                    onChange={handleChange}
                />);
            case 'date_time_picker':
                return (<DateTimePicker
                    {...restElementProps}
                    className={className}
                    name={name}
                    currentDate={currentValue}
                    onChange={handleChange}
                />);
            case 'time_picker':
                return (<TimePicker.TimeInput
                    {...restElementProps}
                    className={className}
                    name={name}
                    currentDate={currentValue}
                    onChange={handleChange}
                />);
            case 'button':
                return <Button {...restElementProps}>{props.text}</Button>;
            case 'visual_label':
                return <BaseControl.VisualLabel>{props.text}</BaseControl.VisualLabel>;
            case 'unit':
                return (<UnitControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue}
                    onChange={handleChange}
                />);
            case 'angle_picker':
                return (<AnglePickerControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    className={className}
                    name={name}
                    value={currentValue}
                    onChange={handleChange}
                />);
            case 'alignment_matrix':
                return (<AlignmentMatrixControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    className={className}
                    name={name}
                    value={currentValue}
                    onChange={handleChange}
                />);
            case 'border_box':
                return (<BorderBoxControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue || {
                        top: '0',
                        right: '0',
                        bottom: '0',
                        left: '0'
                    }}
                    colors={parseJsonArray(restElementProps.colors, 'border_box')}
                    onChange={handleChange}
                />);
            case 'border':
                return (<BorderControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    value={currentValue || undefined}
                    colors={parseJsonArray(restElementProps.colors, 'border')}
                    onChange={handleChange}
                />);
            case 'box':
                return (<BoxControl
                    {...restElementProps}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    name={name}
                    values={currentValue || {
                        top: '0px',
                        right: '0px',
                        bottom: '0px',
                        left: '0px'
                    }}
                    onChange={(newValue) => {
                        // Render values of BoxControl
                        const formattedValue = {
                            top: newValue.top || '0px',
                            right: newValue.right || '0px',
                            bottom: newValue.bottom || '0px',
                            left: newValue.left || '0px'
                        };
                        handleChange(formattedValue);
                    }}
                />);
            case 'toggle_group':
                return (<ToggleGroupField
                    {...restElementProps}
                    options={[...resolvedOptions]}
                    __nextHasNoMarginBottom
                    __next40pxDefaultSize
                    className={className}
                    value={currentValue}
                    onChange={handleChange}
                />);
            case 'color_palette':
                return (<ColorPalette
                    {...restElementProps}
                    className={className}
                    value={currentValue}
                    onChange={handleChange}
                    colors={parseJsonArray(restElementProps.colors, 'color_palette')}
                />);
            case 'combobox':
                return (<ComboboxField
                    {...restElementProps}
                    options={[...resolvedOptions]}
                    className={className}
                    currentValue={selectedOption ? selectedOption.value : ''}
                    handleChange={(value) => {
                        if (value === null || value === undefined) {
                            handleChange('');
                        } else if (typeof value === 'object') {
                            handleChange(value.value);
                        } else {
                            handleChange(value);
                        }
                    }}
                />);
            case 'external_link':
                return (<ExternalLink
                    {...restElementProps}
                    className={className}
                >
                    {restElementProps.children || restElementProps.text}
                </ExternalLink>);
            case 'font_size':
                return (<FontSizePicker
                    {...restElementProps}
                    __next40pxDefaultSize
                    className={className}
                    value={currentValue}
                    fontSizes={parseJsonArray(restElementProps.fontSizes, 'font_size')}
                    onChange={handleChange}
                />);
            case 'file_upload':
                return (<FileUploadField
                    elementProps={{...restElementProps}}
                    className={className}
                    handleChange={handleChange}
                    currentValue={currentValue}
                />);
            case 'media_library':
                return (<MediaLibraryField
                    elementProps={{...restElementProps}}
                    className={className}
                    handleChange={handleChange}
                    currentValue={currentValue}
                />);
            case 'token_field': {
                const {
                    allowOnlySuggestions,
                    __experimentalValidateInput: validateInputProp,
                    ...tokenFieldProps
                } = restElementProps;
                const validateInput = validateInputProp
                    ? validateInputProp
                    : (allowOnlySuggestions && resolvedSuggestions?.length)
                        ? (token) => resolvedSuggestions.includes(token.trim())
                        : undefined;
                return (<FormTokenField
                    {...tokenFieldProps}
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    className={className}
                    value={currentValue || []}
                    suggestions={resolvedSuggestions}
                    onChange={handleChange}
                    {...(validateInput ? {__experimentalValidateInput: validateInput} : {})}
                />);
            }
            case 'heading':
                return (<Heading {...restElementProps} className={className}>
                    {restElementProps.children || restElementProps.text}
                </Heading>);
            case 'notice':
                return (<Notice
                    {...restElementProps}
                    __unstableHTML={true}
                    isDismissible={false}
                    className={className}
                    onRemove={() => {
                        return null;
                    }}
                >
                    {restElementProps.children}
                </Notice>);
            case 'text_highlight':
                return (<TextHighlight
                    {...restElementProps}
                    className={className}
                />);
            case 'group':
                return (<GroupField
                    {...restElementProps}
                    name={name}
                    values={currentValue}
                    onChange={onChange}
                />);
            case 'repeater':
                return (<RepeaterField
                    {...restElementProps}
                    name={name}
                    values={currentValue}
                    onChange={onChange}
                />);
            case 'section':
                return (<GroupField
                    {...restElementProps}
                    name={name}
                    values={currentValue}
                    onChange={onChange}
                />);
            case 'meta_box':
                return (<GroupField
                    {...restElementProps}
                    name={name}
                    values={currentValue}
                    onChange={onChange}
                />);
            default:
                return null;
        }
    };

    // Special cases that don't need BaseControl wrapper
    if (['panel', 'tab_panel', 'panel_row', 'heading', 'notice', 'external_link'].includes(fieldType)) {
        return renderField();
    }

    // Wrap field with BaseControl for all other field types
    // Transform label text if fieldLabelTextTransform parameter is set as 'lowercase' or 'capitalize'
    const classNameForBaseControl = `${fieldLabelTextTransform === 'lowercase' || fieldLabelTextTransform === 'capitalize' ? `label-${fieldLabelTextTransform}` : ''}`.trim();

    let fileUploadHelpText = fieldHelpText;

    if (fieldType === 'file_upload') {
        // if maxFileSize is set, append info to help text
        if (restElementProps.maxFileSize) {
            const maxSizeMB = (restElementProps.maxFileSize / 1024).toFixed(2);
            const sizeInfo = __(` | Maximum file size: (${maxSizeMB}MB)`, 'native-custom-fields');
            fileUploadHelpText = fieldHelpText ? `${fieldHelpText} ${sizeInfo}` : sizeInfo;
        }
    }

    if (fieldType === 'media_library' && restElementProps.allowedTypes) {
        const types = Array.isArray(restElementProps.allowedTypes)
            ? restElementProps.allowedTypes
            : String(restElementProps.allowedTypes).split(',').map(t => t.trim()).filter(Boolean);
        if (types.length > 0) {
            const typeInfo = __(`Allowed types: ${types.join(', ')}`, 'native-custom-fields');
            fileUploadHelpText = fieldHelpText ? `${fieldHelpText} | ${typeInfo}` : typeInfo;
        }
    }

    //Final help text to be rendered
    const fieldHelpTextRendered = ['file_upload', 'media_library'].includes(fieldType) ? fileUploadHelpText : fieldHelpText;

    // Wrap with BaseControl for all other field types
    return (<div className='native-custom-fields-base-control-wrapper'>
            {
                // Check if fieldLabelPosition is set to top
                // If the field has a parent and fieldLabelPosition is not 'top', force fieldLabelPosition to 'top'
                fieldLabelPosition === 'top' ? (
                        <BaseControl
                            id={`field-${name || Math.random().toString(36).substr(2, 9)}`}
                            help={fieldHelpTextRendered}
                            className={`native-custom-fields-base-control ${classNameForBaseControl}`}
                            __nextHasNoMarginBottom
                            hideLabelFromVision={restElementProps.hideLabelFromVision}
                            label={
                                hideLabel ? undefined : (
                                    <BaseControl.VisualLabel>
                                        {fieldLabel}
                                        {restElementProps.required && (<span style={{color: 'red'}}> *</span>)}
                                    </BaseControl.VisualLabel>
                                )
                            }
                        >
                            {renderField()}
                        </BaseControl>
                    ) :
                    (
                        // This is custom design to show labels on side of fields
                        <Flex gap={2} align="top" justify="flex-start" direction={['column', 'row']}>
                            {
                                restElementProps.hideLabelFromVision ? (
                                    <FlexItem className='components-flex-item-custom-width-100'>
                                        {hideLabel ? null : (
                                            <VisuallyHidden>
                                                <label>{fieldLabel}</label>
                                            </VisuallyHidden>
                                        )}
                                        <BaseControl
                                            id={`field-${name || Math.random().toString(36).substr(2, 9)}`}
                                            help={fieldHelpTextRendered}
                                            className={`native-custom-fields-base-control ${classNameForBaseControl}`}
                                            __nextHasNoMarginBottom
                                        >
                                            {renderField()}
                                        </BaseControl>
                                    </FlexItem>

                                ) : (
                                    <>
                                        {!hideLabel && (
                                            <FlexItem className='components-flex-item-custom-width-20'>
                                                <BaseControl.VisualLabel>
                                                    {fieldLabel}
                                                    {restElementProps.required && (
                                                        <span style={{color: 'red'}}> *</span>)}
                                                </BaseControl.VisualLabel>
                                            </FlexItem>
                                        )}
                                        <FlexItem className='components-flex-item-custom-width-100'>
                                            <BaseControl
                                                id={`field-${name || Math.random().toString(36).substr(2, 9)}`}
                                                help={fieldHelpTextRendered}
                                                className={`native-custom-fields-base-control ${classNameForBaseControl}`}
                                                __nextHasNoMarginBottom
                                            >
                                                {renderField()}
                                            </BaseControl>
                                        </FlexItem>
                                    </>
                                )
                            }
                        </Flex>
                    )
            }
        </div>
    );
};

export default RenderSingleField;
