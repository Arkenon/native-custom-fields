import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

const ToggleGroupField = (
	{
		className,
		value,
		onChange,
		currentValue,
		handleChange,
		options = [],
		label,
		isBlock = false,
		...rest
	}
) => {
	const selectedValue = value ?? currentValue;
	const changeHandler = onChange ?? handleChange;

	const normalizedValue =
		selectedValue === undefined || selectedValue === null || selectedValue === ""
			? undefined
			: String(selectedValue);

	const normalizedOptions = (options || []).map(({value: v, label: l}) => ({
		value: String(v),
		label: l,
	}));

	return (
		<ToggleGroupControl
			{...rest}
			className={className}
			label={label}
			value={normalizedValue}
			isBlock={isBlock}
			onChange={changeHandler}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		>
			{normalizedOptions.map(({value: v, label: l}) => (
				<ToggleGroupControlOption key={v} value={v} label={l}/>
			))}
		</ToggleGroupControl>
	);
};

export default ToggleGroupField;
