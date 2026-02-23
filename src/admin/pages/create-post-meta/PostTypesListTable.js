import {__} from '@wordpress/i18n';
import {
    Button,
    Flex,
    __experimentalText as Text,
    Notice,
    Icon
} from '@wordpress/components';
import {plus, commentEditLink, trash, page} from '@wordpress/icons';
import {Header, Table} from "@nativecustomfields/components/index.js";
import {useEffect, useState} from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import AddOrEditFieldsButton from "@nativecustomfields/components/Common/AddOrEditFieldsButton.js";

const PostTypesListTable = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postTypes, setPostTypes] = useState([]);
    const [isDeleting, setIsDeleting] = useState(null);
    const [isSavingToDatabase, setIsSavingToDatabase] = useState(null);

    useEffect(() => {
        loadPostTypes().then(
            (response) => {
                if (response.status) {
                    setPostTypes(response.post_type_list);
                    setError(null);
                } else {
                    setError(response.message);
                }

                setIsLoading(false);
            }
        );
    }, []);


    const loadPostTypes = async () => {
        try {
            return await apiFetch({
                path: '/native-custom-fields/v1/post-meta/get-post-types',
                method: 'GET'
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleAddFields = (row) => {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('post_type_slug', row.post_type_slug);
        currentUrl.searchParams.set('step', 'edit-or-save-post-meta-fields');
        window.location.href = currentUrl.toString();
    }

    const handleEditOrSavePostType = (row = null, isEdit = false) => {
        const currentUrl = new URL(window.location.href);
        row && currentUrl.searchParams.set('post_type_slug', row.post_type_slug);
        currentUrl.searchParams.set('step', 'edit-or-save-post-type');
        isEdit && currentUrl.searchParams.set('edit', 'true');
        window.location.href = currentUrl.toString();
    }


    const handleDelete = async (post_type_slug) => {
        if (confirm(__('Are you sure you want to delete this post type?', 'native-custom-fields'))) {
            try {
                setIsDeleting(post_type_slug);
                const response = await apiFetch({
                    path: `/native-custom-fields/v1/post-meta/delete-post-type`,
                    method: 'DELETE',
                    data: {
                        post_type_slug: post_type_slug,
                    }
                });

                if (response.status) {
                    window.location.reload();
                    setError(null);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };


    const columns = [
        {key: 'no', label: __('No', 'native-custom-fields'),},
        {key: 'post_type', label: __('Name', 'native-custom-fields')},
        {key: 'post_type_slug', label: __('Slug', 'native-custom-fields')},
        {
            key: 'actions',
            label: __('Actions', 'native-custom-fields'),
            className: 'column-actions',
            render: (row) => {
                return (
                    row.created_by === 'native_custom_fields' ?
                        <div className="native-custom-fields-table-actions">
                            <Button
                                variant="secondary"
                                icon={commentEditLink}
                                onClick={() => handleEditOrSavePostType(row, true)}
                            >
                                {__('Edit', 'native-custom-fields')}
                            </Button>
                            <AddOrEditFieldsButton row={row} handleAddFields={handleAddFields}/>
                            <Button
                                variant="secondary"
                                icon={trash}
                                onClick={() => handleDelete(row.post_type_slug)}
                                isDestructive
                                isBusy={isDeleting === row.post_type_slug}
                            >
                                {isDeleting === row.post_type_slug ? __('Deleting', 'native-custom-fields') : __('Delete', 'native-custom-fields')}
                            </Button>
                        </div>
                        :
                        <AddOrEditFieldsButton row={row} handleAddFields={handleAddFields}/>
                );
            }
        }
    ];

    return (<>
        {
            error !== null && <div className='native-custom-fields-app-notice'>
                <Notice status="error" isDismissible={false}>
                    {error}
                </Notice>
            </div>
        }

        <Header
            title={__('Post Types & Post Meta Fields', 'native-custom-fields')}
            buttons={
                (<Button
                    variant="primary"
                    icon={plus}
                    onClick={() => handleEditOrSavePostType(null, false)}
                >
                    {__('Create Post Type', 'native-custom-fields')}
                </Button>)
            }
        />

        <Table
            columns={columns}
            data={postTypes}
            isLoading={isLoading}
            emptyMessage={
                <Flex direction="column" align="center" gap={4}>
                    <Icon icon={page} size={50}/>
                    <Text variant="title.small">
                        {__('No post type found.', 'native-custom-fields')}
                    </Text>
                    <Text>
                        {__('Create your first post type to get started.', 'native-custom-fields')}
                    </Text>
                </Flex>
            }
        />
    </>);
}

export default PostTypesListTable;
