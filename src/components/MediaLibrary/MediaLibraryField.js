import {useEffect, useRef, useState} from "@wordpress/element";
import {Button, Icon} from "@wordpress/components";
import {upload} from "@wordpress/icons";
import {__} from "@wordpress/i18n";
import FilePreviewList from "@nativecustomfields/components/Common/FilePreviewList.js";

/**
 * Converts allowedTypes config value to wp.media compatible array.
 * Accepts array or comma-separated string.
 * e.g. "image,video" => ["image", "video"]
 *
 * @param {string|string[]|undefined} allowedTypes
 * @returns {string[]|undefined}
 */
const resolveAllowedTypes = (allowedTypes) => {
    if (!allowedTypes) return undefined;
    if (Array.isArray(allowedTypes)) return allowedTypes.filter(Boolean);
    if (typeof allowedTypes === 'string') {
        return allowedTypes.split(',').map(t => t.trim()).filter(Boolean);
    }
    return undefined;
};

/**
 * Normalises a wp.media attachment object into the shared file format:
 * { file_name, file_to_upload, file_size }
 *
 * @param {Object} attachment  wp.media attachment attributes
 * @returns {{ file_name: string, file_to_upload: string, file_size: string }}
 */
const normaliseAttachment = (attachment) => {
    const attrs = attachment.attributes ?? attachment;
    const sizeBytes = attrs.filesizeInBytes ?? attrs.filesize ?? 0;
    const sizeLabel = sizeBytes
        ? sizeBytes >= 1024 * 1024
            ? `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`
            : `${(sizeBytes / 1024).toFixed(1)} KB`
        : '';

    return {
        file_name: attrs.filename ?? attrs.title ?? '',
        file_to_upload: attrs.url ?? '',
        file_size: sizeLabel,
    };
};

/**
 * MediaLibraryField
 *
 * Opens the native WordPress media library (wp.media) and stores selected
 * files in the same format as FileUploadField.
 *
 * @param {Object}   props
 * @param {Object}   props.elementProps           Field configuration props
 * @param {string}   [props.elementProps.allowedTypes]  Comma-separated or array: "image,video"
 * @param {boolean}  [props.elementProps.multiple=false]
 * @param {string}   [props.className]
 * @param {Function} props.handleChange            Called with updated files array
 * @param {Array}    [props.currentValue]           Current value (array of file objects)
 */
const MediaLibraryField = ({elementProps = {}, className, handleChange, currentValue}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const frameRef = useRef(null);

    // Sync external value
    useEffect(() => {
        setSelectedFiles(Array.isArray(currentValue) ? currentValue : []);
    }, [JSON.stringify(currentValue)]);

    const multiple = !!elementProps.multiple;
    const allowedTypes = resolveAllowedTypes(elementProps.allowedTypes);

    const openMediaLibrary = () => {
        // Reuse existing frame if available
        if (frameRef.current) {
            frameRef.current.open();
            return;
        }

        const frameArgs = {
            title: __('Select or Upload Media', 'native-custom-fields'),
            button: {text: __('Select', 'native-custom-fields')},
            multiple: multiple ? 'add' : false,
        };

        if (allowedTypes && allowedTypes.length > 0) {
            frameArgs.library = {type: allowedTypes};
        }

        const frame = window.wp.media(frameArgs);

        frame.on('select', () => {
            const selection = frame.state().get('selection');
            const newAttachments = selection.map(normaliseAttachment);

            setSelectedFiles(prev => {
                const updated = multiple ? [...prev, ...newAttachments] : newAttachments;
                handleChange(updated);
                return updated;
            });
        });

        frameRef.current = frame;
        frame.open();
    };

    const removeFile = (index) => {
        const confirmed = window.confirm(
            __('Are you sure you want to remove this file?', 'native-custom-fields')
        );
        if (!confirmed) return;

        setSelectedFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            handleChange(updated);
            return updated;
        });
    };

    return (
        <div className="native-custom-fields-file-upload native-custom-fields-media-library">
            {selectedFiles.length === 0 && (
                <Button
                    className={`native-custom-fields-media-library-open-button ${className || ''}`}
                    onClick={openMediaLibrary}
                    icon={<Icon icon={upload} />}
                    __next40pxDefaultSize
                    variant="secondary"
                >
                    {__('Select from Media Library', 'native-custom-fields')}
                </Button>
            )}

            {selectedFiles.length > 0 && (
                <>
                    <FilePreviewList
                        files={selectedFiles}
                        onRemove={removeFile}
                    />
                    {multiple && (
                        <Button
                            className="native-custom-fields-media-library-add-more-button"
                            onClick={openMediaLibrary}
                            icon={<Icon icon={upload} />}
                            variant="secondary"
                            __next40pxDefaultSize
                        >
                            {__('Add More', 'native-custom-fields')}
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default MediaLibraryField;

