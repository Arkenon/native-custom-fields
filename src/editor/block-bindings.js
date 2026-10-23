/**
 * WordPress dependencies
 */
import {registerBlockBindingsSource, getBlockType} from '@wordpress/blocks';
import {store as blockEditorStore} from '@wordpress/block-editor';
import {store as coreStore} from '@wordpress/core-data';
import {escapeHTML} from '@wordpress/escape-html';
import {applyFilters} from '@wordpress/hooks';
import {dateI18n, gmdateI18n} from '@wordpress/date';

/**
 * Internal dependencies
 */
import {parseStaticOptionsString, isDynamicOptionsString} from '@nativecustomfields/common/optionsHelper.js';

/**
 * Editor side of the "native-custom-fields/post-meta" block bindings source.
 * Lists every Native Custom Fields field (also array/object ones) as a string field and
 * previews the formatted value. The source is read only; values are edited in the meta box.
 *
 * @version 1.4.3
 */

const data = window.nativeCustomFieldsBlockBindings || {};
const fieldsByPostType = data.fields || {};

/** Attributes that receive HTML when the block type is unknown */
const RICH_TEXT_FALLBACK = ['content', 'text', 'caption'];

/**
 * Escape text that goes into a rich text attribute.
 *
 * @param {string} text
 * @param {boolean} richText
 * @returns {string}
 * @version 1.4.3
 */
const escapeText = (text, richText) => (richText ? escapeHTML(text) : text);

/**
 * Get the URLs of a file field value.
 *
 * @param {*} value One file item or a list of file items
 * @returns {string[]}
 * @version 1.4.3
 */
const getFileUrls = (value) => {
	if (!value || typeof value !== 'object') {
		return typeof value === 'string' && value !== '' ? [value] : [];
	}

	const items = Array.isArray(value) ? value : [value];

	return items
		.map((item) => (item && typeof item === 'object' ? item.file_to_upload ?? item.url ?? '' : item))
		.filter((url) => typeof url === 'string' && url !== '');
};

/**
 * Format a stored date, date time or time value with the date and time formats of the site settings.
 * Stored values are the wall-clock time of the site (2026-10-22, 2026-10-22T12:00, 12:00).
 * Keep in sync with BlockBindingsService::formatDate().
 *
 * @param {*} value Stored value
 * @param {string} dateType date, datetime or time
 * @returns {string} Formatted value, or the stored value when it can not be read as a date
 * @version 1.4.5
 */
const formatDate = (value, dateType) => {
	// A time picker value can be an hours/minutes object
	if (value && typeof value === 'object' && 'hours' in value) {
		const pad = (number) => String(parseInt(number, 10) || 0).padStart(2, '0');
		value = `${pad(value.hours)}:${pad(value.minutes)}`;
	}

	if (value === null || value === undefined || typeof value === 'object') {
		return '';
	}

	value = String(value).trim();

	if (value === '') {
		return '';
	}

	const isTime = /^\d{1,2}:\d{2}(:\d{2})?$/.test(value);
	const isDate = /^\d{4}-\d{2}-\d{2}/.test(value);
	const format = (data.dateFormats || {})[isTime ? 'time' : dateType];

	if ((!isTime && !isDate) || !format) {
		return value;
	}

	let iso;
	if (isTime) {
		iso = `1970-01-01T${value.replace(/^(\d):/, '0$1:')}`;
	} else {
		iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value.replace(' ', 'T');
	}

	const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);

	if (isNaN(new Date(hasOffset ? iso : `${iso}Z`).getTime())) {
		return value;
	}

	// A value without an offset is already the site time: read and print it as UTC so neither
	// the browser nor the site timezone shifts it. A value with an offset is shown in the site timezone.
	return hasOffset ? dateI18n(format, iso) : gmdateI18n(format, `${iso}Z`);
};

/**
 * Format a stored value as a string.
 * Keep in sync with BlockBindingsService::formatValue().
 *
 * @param {*} value Stored value
 * @param {Object} field Field configuration
 * @param {boolean} richText Whether the result goes into an HTML (rich text) attribute
 * @param {string} attributeName Bound attribute name
 * @returns {string}
 * @version 1.4.3
 */
export const formatValue = (value, field, richText, attributeName = '') => {
	const fieldType = field?.fieldType || 'text';
	const separator = richText ? '<br>' : ', ';

	if (typeof value === 'string' && ['repeater', 'group', 'file_upload', 'media_library'].includes(fieldType)) {
		try {
			const decoded = JSON.parse(value);
			value = decoded && typeof decoded === 'object' ? decoded : value;
		} catch (e) {
			// Not JSON, keep the string
		}
	}

	switch (fieldType) {
		case 'toggle':
		case 'checkbox':
			return [true, 1, '1', 'true', 'yes', 'on'].includes(value) ? data.yes : data.no;

		case 'file_upload':
		case 'media_library': {
			const urls = getFileUrls(value);
			return attributeName === 'url' ? urls[0] ?? '' : escapeText(urls.join(', '), richText);
		}

		case 'repeater':
			if (!Array.isArray(value)) {
				return '';
			}

			return value
				.filter((row) => row && typeof row === 'object')
				.map((row) =>
					(field.fields || [])
						.map((subField) => formatValue(row[subField.name] ?? '', subField, richText))
						.filter((cell) => cell !== '')
						.join(' — ')
				)
				.filter((row) => row !== '')
				.join(separator);

		case 'group':
			if (!value || typeof value !== 'object' || Array.isArray(value)) {
				return '';
			}

			return (field.fields || [])
				.map((subField) => {
					const line = formatValue(value[subField.name] ?? '', subField, richText);
					if (line === '') {
						return '';
					}
					const label = escapeText(String(subField.label ?? subField.name ?? ''), richText);
					return label !== '' ? `${label}: ${line}` : line;
				})
				.filter((line) => line !== '')
				.join(separator);
	}

	// Dates and times in the date and time formats of the site settings
	if (field?.dateType) {
		return escapeText(formatDate(value, field.dateType), richText);
	}

	// Select labels instead of stored values
	const labels = {};
	if (['select', 'radio', 'toggle_group', 'combobox'].includes(fieldType) && !isDynamicOptionsString(field.options)) {
		parseStaticOptionsString(field.options).forEach((option) => {
			labels[option.value] = option.label;
		});
	}

	const items = Array.isArray(value) ? value : [value];
	const text = escapeText(
		items
			.filter((item) => item !== null && item !== undefined && item !== '' && typeof item !== 'object')
			.map((item) => labels[String(item)] ?? String(item))
			.join(', '),
		richText
	);

	// Keep the line breaks of multiline fields
	return richText ? text.replace(/\r?\n/g, '<br>') : text;
};

/**
 * Check whether an attribute of the bound block holds rich text.
 *
 * @param {Function} select
 * @param {string} clientId
 * @param {string} attributeName
 * @returns {boolean}
 * @version 1.4.3
 */
const isRichTextAttribute = (select, clientId, attributeName) => {
	const blockName = clientId ? select(blockEditorStore).getBlockName(clientId) : null;
	const attribute = blockName ? getBlockType(blockName)?.attributes?.[attributeName] : null;

	if (!attribute) {
		return RICH_TEXT_FALLBACK.includes(attributeName);
	}

	return attribute.source === 'rich-text' || attribute.type === 'rich-text';
};

registerBlockBindingsSource({
	name: data.source || 'native-custom-fields/post-meta',
	label: data.label,
	usesContext: ['postId', 'postType'],
	getValues({select, context, bindings, clientId}) {
		const fields = fieldsByPostType[context?.postType] || [];
		const meta = context?.postId
			? select(coreStore).getEditedEntityRecord('postType', context.postType, context.postId)?.meta || {}
			: null;
		const values = {};

		for (const [attributeName, binding] of Object.entries(bindings)) {
			const key = binding?.args?.key;
			const field = fields.find((item) => item.name === key);

			if (!field) {
				values[attributeName] = key;
				continue;
			}

			// No post to read from (for example a template): show the field label
			if (!meta) {
				values[attributeName] = field.label || key;
				continue;
			}

			const richText = isRichTextAttribute(select, clientId, attributeName);
			const formatted = formatValue(meta[key], field, richText, attributeName);

			/**
			 * Filter the editor preview of a bound Native Custom Fields value.
			 * Mirrors the native_custom_fields_block_bindings_value PHP filter.
			 */
			values[attributeName] = applyFilters(
				'nativeCustomFields.blockBindingsValue',
				formatted,
				meta[key],
				field,
				context.postId,
				attributeName
			);
		}

		return values;
	},
	canUserEditValue() {
		return false;
	},
	getFieldsList({context}) {
		return (fieldsByPostType[context?.postType] || []).map((field) => ({
			label: field.label || field.name,
			type: 'string',
			args: {key: field.name},
		}));
	},
});
