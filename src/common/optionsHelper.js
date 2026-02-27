/**
 * WordPress dependencies
 */
import {useSelect} from '@wordpress/data';
import {store as coreStore} from '@wordpress/core-data';

/**
 * Quick check: is the given input a dynamic options string?
 * Example: "{{users?role=admin}} {{posts?per_page=10}}"
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
			return {source, params};
		})
		.filter((t) => t.source);
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
				label: m.title.rendered,
				value: m.id,
			}));
		case 'roles':
			return entities.map((r) => ({
				label: r.name || r.slug,
				value: r.slug,
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
 * @param {string|null} optionsString Dynamic options string or null
 * @returns {{ options: Array<{label:string,value:any}>, isLoading: boolean }}
 */
export function useDynamicOptions(optionsString) {
	const tokens = parseDynamicTokens(optionsString || '');

	const result = useSelect(
		(select) => {
			if (!tokens.length) return {combined: [], loading: false};

			let combined = [];
			let loading = false;

			tokens.forEach(({source, params}) => {
				if (source === 'users') {
					const query = {...params};
					const users = select(coreStore).getEntityRecords('root', 'user', query);
					if (!users) loading = true;
					combined = combined.concat(mapEntitiesToOptions('users', users || []));
				} else if (source === 'posts') {
					const {type = 'post', ...rest} = params || {};
					const query = {...rest};
					const posts = select(coreStore).getEntityRecords('postType', type, query);
					if (!posts) loading = true;
					combined = combined.concat(mapEntitiesToOptions('posts', posts || []));
				} else if (source === 'pages') {
					const {type = 'page', ...rest} = params || {};
					const query = {...rest};
					const posts = select(coreStore).getEntityRecords('postType', type, query);
					if (!posts) loading = true;
					combined = combined.concat(mapEntitiesToOptions('posts', posts || []));
				} else if (source === 'taxonomies') {
					const taxonomies = select(coreStore).getTaxonomies(params || {});
					if (!taxonomies) loading = true;
					combined = combined.concat(mapEntitiesToOptions('taxonomies', taxonomies || []));
				} else if (source === 'categories') {
					const query = {...params};
					const categories = select(coreStore).getEntityRecords('taxonomy', 'category', query);
					if (!categories) loading = true;
					combined = combined.concat(mapEntitiesToOptions('categories', categories || []));
				} else if (source === 'tags') {
					const query = {...params};
					const tags = select(coreStore).getEntityRecords('taxonomy', 'post_tag', query);
					if (!tags) loading = true;
					combined = combined.concat(mapEntitiesToOptions('tags', tags || []));
				} else if (source === 'menus') {
					const query = {...params};
					const menus = select(coreStore).getEntityRecords('postType', 'wp_navigation', query);
					if (!menus) loading = true;
					combined = combined.concat(mapEntitiesToOptions('menus', menus || []));
				} else if (source === 'post_types') {
					const postTypes = select(coreStore).getPostTypes(params || {});
					if (!postTypes) loading = true;
					combined = combined.concat(mapEntitiesToOptions('post_types', postTypes || []));
				}
			});

			return {combined, loading};
		},
		// Re-run when optionsString changes
		[optionsString]
	);

	return {options: result.combined || [], isLoading: !!result.loading};
}
