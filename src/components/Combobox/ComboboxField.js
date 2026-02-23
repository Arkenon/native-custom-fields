import {useState, useEffect} from "@wordpress/element";
import {ComboboxControl} from "@wordpress/components";

const ComboboxField = (
	{
		className,
		currentValue,
		handleChange,
		options = [],
		isLoading,
		...rest
	}
) => {
	const [filteredOptions, setFilteredOptions] = useState(options);

	useEffect(() => {
		setFilteredOptions(options || []);
	}, [options, currentValue]);

	const handleFilter = (inputValue) => {
		if (!options?.length) return;

		const q = String(inputValue ?? "").trim().toLowerCase();
		const selected = options.find((o) => String(o?.value) === String(currentValue));
		const selectedLabel = String(selected?.label ?? "").toLowerCase();

		if (
			!q ||
			q === String(currentValue).toLowerCase() ||
			(selectedLabel && q === selectedLabel)
		) {
			setFilteredOptions(options);
			return;
		}

		setFilteredOptions(
			options.filter((o) =>
				String(o?.label ?? "").toLowerCase().includes(q)
			)
		);
	};

	return (
		<ComboboxControl
			{...rest}
			__next40pxDefaultSize
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
