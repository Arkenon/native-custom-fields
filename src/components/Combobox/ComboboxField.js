import {useState, useEffect, useRef} from "@wordpress/element";
import {ComboboxControl} from "@wordpress/components";

/**
 * Delay before a keystroke is turned into a REST request, so typing a name does
 * not fire one request per character.
 */
const SEARCH_DEBOUNCE_MS = 300;

const ComboboxField = (
	{
		className,
		currentValue,
		handleChange,
		options = [],
		isLoading,
		onSearch,
		...rest
	}
) => {
	const [filteredOptions, setFilteredOptions] = useState(options);
	const debounceRef = useRef(null);

	// When `onSearch` is given the option list is already narrowed server side,
	// so filtering it again locally would only hide freshly fetched matches.
	const isServerSearch = typeof onSearch === 'function';

	useEffect(() => {
		setFilteredOptions(options || []);
	}, [options, currentValue]);

	useEffect(() => () => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}
	}, []);

	const handleFilter = (inputValue) => {
		const q = String(inputValue ?? "").trim();
		const selected = options.find((o) => String(o?.value) === String(currentValue));
		const selectedLabel = String(selected?.label ?? "");

		// Opening the control re-emits the current selection as filter input;
		// treat that as "no query" so the full list stays visible.
		const isEchoOfSelection =
			!q ||
			q.toLowerCase() === String(currentValue).toLowerCase() ||
			(selectedLabel && q.toLowerCase() === selectedLabel.toLowerCase());

		if (isServerSearch) {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
			debounceRef.current = setTimeout(() => {
				onSearch(isEchoOfSelection ? "" : q);
			}, SEARCH_DEBOUNCE_MS);
			return;
		}

		if (!options?.length) return;

		if (isEchoOfSelection) {
			setFilteredOptions(options);
			return;
		}

		setFilteredOptions(
			options.filter((o) =>
				String(o?.label ?? "").toLowerCase().includes(q.toLowerCase())
			)
		);
	};

	return (
		<ComboboxControl
			{...rest}
			__nextHasNoMarginBottom
			className={className}
			isLoading={isLoading}
			value={currentValue ?? ""}
			onChange={handleChange}
			options={filteredOptions.map(({value, label}) => ({value, label}))}
			onFilterValueChange={handleFilter}
		/>
	);
};

export default ComboboxField;
