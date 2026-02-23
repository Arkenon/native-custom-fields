/**
 * WordPress dependencies
 */
import RenderSingleField from "@nativecustomfields/render/RenderSingleField.js";
import {checkCondition} from "@nativecustomfields/common/helper.js";

/**
 * Render all fields
 * Includes WordPress Components and Custom Components
 * @version 1.0.0
 * @param {Object} props Component properties
 * @param {Array} props.fields Fields to render
 * @param {Object} [props.values] Form values
 * @param {Function} [props.onChange] Value change handler
 * @param {string} [props.nodeId] Node ID for unique keys (optional, for TreeViewForm)
 * @returns {(null|*)[]} Rendered fields
 */
const RenderFields = ({fields, values = {}, onChange, nodeId}) => {

    if (!fields || !Array.isArray(fields)) {
        return null;
    }

    return fields.map((field, index) => {
        const key = field.name || field.title || index;
        // Use nodeId in key to ensure unique keys across different nodes
        const uniqueKey = nodeId ? `${nodeId}-field-${key}` : `field-${key}`;

		// Check condition before rendering field
		if (field.dependencies && !checkCondition(field.dependencies, values)) {
			return null;
		}

        return (
            <div
                key={uniqueKey}
                className='native-custom-fields-field'
            >
                <RenderSingleField
                    key={uniqueKey}
                    {...field}
                    values={values}
                    onChange={onChange}
                />
            </div>
        );
    });
};

export default RenderFields;
