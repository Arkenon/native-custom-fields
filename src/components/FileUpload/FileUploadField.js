import {useEffect, useState} from "@wordpress/element";
import {FormFileUpload, Icon} from "@wordpress/components";
import {upload} from "@wordpress/icons";
import {__} from "@wordpress/i18n";
import FilePreviewList from "@nativecustomfields/components/Common/FilePreviewList.js";

const FileUploadField = ({elementProps, className, handleChange, currentValue}) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        setUploadedFiles(Array.isArray(currentValue) ? currentValue : []);
    }, [JSON.stringify(currentValue)]);

    const [isUploading, setIsUploading] = useState(false);

    const uploadFiles = async (event) => {
        setIsUploading(true);
        const files = event.target.files;

        if (elementProps.maxFileSize && elementProps.maxFileSize > 0) {
            const maxSizeBytes = elementProps.maxFileSize * 1024;
            const oversizedFiles = Array.from(files).filter(file => file.size > maxSizeBytes);

            if (oversizedFiles.length > 0) {
                const oversizedFileNames = oversizedFiles.map(file => file.name).join(', ');
                const maxSizeMB = (elementProps.maxFileSize / 1024).toFixed(2);
                alert(__(`Following files are too large: ${oversizedFileNames}. Maximum file size is ${elementProps.maxFileSize}KB (${maxSizeMB}MB).`, 'native-custom-fields'));
                setIsUploading(false);
                return;
            }
        }

        const formData = new FormData();

        // Add files to FormData
        Array.from(files).forEach((file) => {
            formData.append('files[]', file);
        });

        // Add nonce
        formData.append('action', 'native_custom_fields_upload_files');
        formData.append('nonce', window.nativeCustomFieldsData.nonce);

        try {
            const response = await fetch(window.nativeCustomFieldsData.ajax_url, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (data.success) {
                const newFiles = data.data.files;
                setUploadedFiles(prev => {
                    const updated = [...prev, ...newFiles];
                    handleChange(updated);
                    return updated;
                });
                setIsUploading(false);
            } else {
                console.error('Upload failed:', data.data.message);
                setIsUploading(false);
            }


        } catch (error) {
            console.error('Upload error:', error);
            setIsUploading(false);
        }
    };


    const removeFile = (index) => {
        const confirmed = window.confirm(
            __('Are you sure you want to remove this file?', 'native-custom-fields')
        );

        if (!confirmed) return;

        setUploadedFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            handleChange(updated);
            return updated;
        });
    };


    return (
        <div className="native-custom-fields-file-upload">
            {uploadedFiles.length === 0 && (
                <FormFileUpload
                    {...elementProps}
                    className={className}
                    disabled={isUploading}
                    onChange={uploadFiles}
                    __next40pxDefaultSize
                    icon={<Icon icon={upload} />}
                    accept={elementProps.accept || '*'}
                />
            )}

            {uploadedFiles.length > 0 && (
                <FilePreviewList
                    files={uploadedFiles}
                    onRemove={removeFile}
                />
            )}
        </div>
    );
};

export default FileUploadField;