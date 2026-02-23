/**
 * WordPress dependencies
 */
import {useEffect} from '@wordpress/element';

/**
 * Internal dependencies
 */
import {Header, Panel} from '..';
import RenderFields from '../../render/RenderFields';

/**
 * Render stacked sections layout
 *
 * @param {Object} props Component properties
 * @param {Array} props.sections Sections configuration
 * @param {Object} props.values Field values
 * @param {string} props.pageTitle Page title
 * @param {Function} props.onChange Value change handler
 * @param {Function} props.onSectionChange Section change handler
 * @param {boolean} props.showHeader Show header
 * @returns {React.ReactElement} Stacked sections layout
 */
const StackedSectionsLayout = (
	{
		sections,
		values,
		pageTitle,
		onChange,
		onSectionChange,
		showHeader = true
	}
) => {
	// Validate fields structure
	useEffect(() => {
		sections.forEach((section, index) => {
			if (!section.section_name) {
				console.warn(`Section at index ${index} is missing 'section_name' property`);
			}
		});
	}, [sections]);

	return (
		<>
			{showHeader && (<Header title={pageTitle}/>)}
			<div className="native-custom-fields-stacked-sections">
				{sections.map((section, index) => (
					<Panel
						key={section.section_name || `section-${index}`}
						title={section.section_title}
						icon={section.section_icon}
						initialOpen={true}
						className="native-custom-fields-stacked-section"
						onToggle={() => {
							if (typeof onSectionChange === 'function') {
								onSectionChange(section.section_name);
							}
						}}
					>
						<RenderFields
							fields={section.fields}
							values={values[section.section_name]}
							onChange={onChange}
						/>
					</Panel>
				))}
			</div>
		</>
	);
};

export default StackedSectionsLayout;
