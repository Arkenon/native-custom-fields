/**
 * WordPress dependencies
 */
import {useSelect} from '@wordpress/data';
import {store as coreStore} from '@wordpress/core-data';

/**
 * Hard limit enforced by the WordPress REST API on the `per_page` argument.
 * Anything above it makes the request fail with `rest_invalid_param`, which
 * surfaces as "no options at all" instead of "too many options".
 */
const REST_MAX_PER_PAGE = 100;

/**
 * Sources whose records are fetched through a collection endpoint that accepts
 * the REST `search` argument, so the options can be narrowed server side.
 */
const SEARCHABLE_SOURCES = ['users', 'posts', 'pages', 'categories', 'tags', 'menus'];

/**
 * Quick check: is the given input a dynamic options string?
 * Example: "{{users?roles=administrator}} {{posts?per_page=10}}"
 */
export function isDynamicOptionsString(input) {
	return typeof input === 'string' && /{{[^}]+}}/.test(input);
}

/**
 * Parse a static options string into an array of { label, value }.
 * Format: "Label 1 : value_1, Label 2 : value_2"
 */
export function parseStaticOptionsString(input) {
	if (typeof input !== 'string') return [];
	return input
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean)
		.map((pair) => {
			const [labelRaw, valueRaw] = pair.split(':');
			const label = (labelRaw || '').trim();
			const value = (valueRaw || '').trim();
			if (!label && !value) return null;
			return {label: label || value, value: value || label};
		})
		.filter(Boolean);
}

/**
 * Clamp `per_page` into the range the REST API actually accepts.
 * `all` and `-1` are accepted as author-friendly spellings of "as many as possible".
 */
function normalizeParams(params) {
	const normalized = {...params};
	if (typeof normalized.per_page !== 'undefined') {
		const raw = String(normalized.per_page).trim().toLowerCase();
		const parsed = (raw === 'all' || raw === '-1') ? REST_MAX_PER_PAGE : parseInt(raw, 10);
		normalized.per_page = (!Number.isFinite(parsed) || parsed < 1)
			? REST_MAX_PER_PAGE
			: Math.min(parsed, REST_MAX_PER_PAGE);
	}
	return normalized;
}

/**
 * Extract dynamic tokens from a string like: "{{token?query}}".
 * Returns an array of objects: { source: string, params: Record<string,string> }.
 */
export function parseDynamicTokens(input) {
	if (!isDynamicOptionsString(input)) return [];
	const matches = input.match(/{{[^}]+}}/g) || [];
	return matches
		.map((m) => m.replace(/^{{/, '').replace(/}}$/, ''))
		.map((chunk) => {
			const [sourceRaw, qsRaw] = chunk.split('?');
			const source = (sourceRaw || '').trim();
			const params = {};
			if (qsRaw) {
				const sp = new URLSearchParams(qsRaw);
				for (const [k, v] of sp.entries()) {
					params[k] = v;
				}
			}
			return {source, params: normalizeParams(params)};
		})
		.filter((t) => t.source);
}

/**
 * Describe which core-data entity backs a token, so a token can be resolved both
 * as a collection (the option list) and as a single record (the selected value).
 *
 * @param {string} source Token name
 * @param {Object} params Token parameters
 * @returns {{kind: string, name: string, query: Object}|null}
 */
function getEntityDescriptor(source, params) {
	const {type, ...rest} = params || {};
	switch (source) {
		case 'users':
			return {kind: 'root', name: 'user', query: {...params}};
		case 'posts':
			return {kind: 'postType', name: type || 'post', query: rest};
		case 'pages':
			return {kind: 'postType', name: type || 'page', query: rest};
		case 'menus':
			return {kind: 'postType', name: 'wp_navigation', query: {...params}};
		case 'categories':
			return {kind: 'taxonomy', name: 'category', query: {...params}};
		case 'tags':
			return {kind: 'taxonomy', name: 'post_tag', query: {...params}};
		default:
			// `taxonomies` and `post_types` use dedicated selectors, not entity records.
			return null;
	}
}

function mapEntitiesToOptions(source, entities) {
	if (!Array.isArray(entities)) return [];
	switch (source) {
		case 'users':
			return entities.map((u) => ({
				label: u.name || u.slug || String(u.id),
				value: u.id,
			}));
		case 'posts':
			return entities.map((p) => ({
				label: (p.title && (p.title.raw || p.title.rendered)) || `#${p.id}`,
				value: p.id,
			}));
		case 'pages':
			return entities.map((p) => ({
				label: (p.title && (p.title.raw || p.title.rendered)) || `#${p.id}`,
				value: p.id,
			}));
		case 'taxonomies':
			return entities.map((t) => ({
				label: t.name || t.slug,
				value: t.slug,
			}));
		case 'categories':
			return entities.map((c) => ({
				label: c.name || c.slug,
				value: c.id,
			}));
		case 'tags':
			return entities.map((t) => ({
				label: t.name || t.slug,
				value: t.id,
			}));
		case 'menus':
			return entities.map((m) => ({
				label: (m.title && (m.title.raw || m.title.rendered)) || `#${m.id}`,
				value: m.id,
			}));
		case 'post_types':
			return entities.map((pt) => ({
				label: pt.labels?.singular_name || pt.slug,
				value: pt.slug,
			}));
		default:
			return [];
	}
}

/**
 * React hook that fetches dynamic options via the WordPress core-data store.
 *
 * When `searchTerm` is given, the term is forwarded to the REST API as `search`
 * so that the whole collection stays reachable even though a single request can
 * never return more than `REST_MAX_PER_PAGE` records. The record matching
 * `selectedValue` is fetched separately and kept in the list, otherwise the
 * stored value would lose its label as soon as it falls outside the search hits.
 *
 * @param {string|null}   optionsString Dynamic options string or null
 * @param {string}        searchTerm    Term typed by the user, forwarded to the REST API
 * @param {string|number} selectedValue Currently stored value, kept resolvable
 * @returns {{ options: Array<{label:string,value:any}>, isLoading: boolean }}
 */
export function useDynamicOptions(optionsString, searchTerm = '', selectedValue = '') {
	const search = String(searchTerm ?? '').trim();
	const selected = (selectedValue === null || typeof selectedValue === 'undefined')
		? ''
		: String(selectedValue);

	const result = useSelect(
		(select) => {
			const tokens = parseDynamicTokens(optionsString || '');
			if (!tokens.length) return {combined: [], loading: false};

			const combined = [];
			let loading = false;
			const seen = new Set();

			const push = (source, records) => {
				mapEntitiesToOptions(source, records).forEach((option) => {
					const key = `${source}:${option.value}`;
					if (seen.has(key)) return;
					seen.add(key);
					combined.push(option);
				});
			};

			tokens.forEach(({source, params}) => {
				if (source === 'taxonomies') {
					const taxonomies = select(coreStore).getTaxonomies(params || {});
					if (!taxonomies) loading = true;
					push('taxonomies', taxonomies || []);
					return;
				}

				if (source === 'post_types') {
					const postTypes = select(coreStore).getPostTypes(params || {});
					if (!postTypes) loading = true;
					push('post_types', postTypes || []);
					return;
				}

				const descriptor = getEntityDescriptor(source, params);
				if (!descriptor) return;

				const {kind, name, query} = descriptor;

				// Keep the stored value selectable even when it is not part of the
				// current page of results, so its label never degrades to a bare ID.
				if (selected !== '') {
					const record = select(coreStore).getEntityRecord(kind, name, selected);
					if (record) {
						push(source, [record]);
					}
				}

				const listQuery = {...query};
				if (search && SEARCHABLE_SOURCES.includes(source) && !listQuery.search) {
					listQuery.search = search;
				}

				const records = select(coreStore).getEntityRecords(kind, name, listQuery);
				if (!records) loading = true;
				push(source, records || []);
			});

			return {combined, loading};
		},
		// Re-run when the token string, the search term or the stored value changes
		[optionsString, search, selected]
	);

	return {options: result.combined || [], isLoading: !!result.loading};
}
