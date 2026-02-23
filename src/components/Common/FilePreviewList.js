import {useState} from "@wordpress/element";
import {Button, Icon} from "@wordpress/components";
import {closeSmall, copy, check} from "@wordpress/icons";
import {__} from "@wordpress/i18n";
import {copyToClipboard} from "@nativecustomfields/common/helper.js";

/**
 * Shared file preview list used by FileUploadField and MediaLibraryField.
 *
 * @param {Object}   props
 * @param {Array}    props.files          Array of {file_name, file_to_upload, file_size}
 * @param {Function} props.onRemove       Called with (index) when remove button clicked
 * @param {string}   [props.assetsUrl]    Base URL for fallback thumbnail
 */
const FilePreviewList = ({files = [], onRemove, assetsUrl}) => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    const isImageFile = (url = '') =>
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

    const getPreviewSrc = (file) => {
        if (isImageFile(file.file_to_upload)) {
            return file.file_to_upload;
        }
        return (assetsUrl || window.nativeCustomFieldsData?.assets_url || '') + '/img/file_thumb.png';
    };

    const handleCopy = async (text, index) => {
        try {
            const success = await copyToClipboard(text);
            if (!success) return;

            setCopiedIndex(index);
            alert(__(`File URL copied!\n\n${text}`, 'native-custom-fields'));
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error(__('Failed to copy file URL', 'native-custom-fields'), err);
        }
    };

    return (
        <div className="native-custom-fields-file-upload-previews">
            {files.map((file, index) => (
                <div key={index} className="native-custom-fields-file-upload-preview">
                    <div className="native-custom-fields-file-upload-preview-image">
                        <img
                            src={getPreviewSrc(file)}
                            alt={file.file_name}
                        />
                        <div className="native-custom-fields-file-upload-preview-actions">
                            <Button
                                className="native-custom-fields-file-upload-preview-remove"
                                icon={<Icon icon={closeSmall} />}
                                onClick={() => onRemove(index)}
                                label={__('Remove file', 'native-custom-fields')}
                                showTooltip
                            />
                            <Button
                                className="native-custom-fields-file-upload-preview-copy"
                                icon={<Icon icon={copiedIndex === index ? check : copy} />}
                                onClick={() => handleCopy(file.file_to_upload, index)}
                                label={copiedIndex === index ? __('Copied!', 'native-custom-fields') : __('Copy URL', 'native-custom-fields')}
                                showTooltip
                            />
                        </div>
                    </div>
                    <span className="native-custom-fields-file-upload-preview-name">{file.file_name}</span>
                </div>
            ))}
        </div>
    );
};

export default FilePreviewList;

