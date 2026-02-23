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

const TaxonomyListTable = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [taxonomies, setTaxonomies] = useState([]);
    const [isDeleting, setIsDeleting] = useState(null);
    const [isSavingToDatabase, setIsSavingToDatabase] = useState(null);

    useEffect(() => {
        loadTaxonomies().then(
            (response) => {
                if (response.status) {
                    setTaxonomies(response.taxonomy_list);
                    setError(null);
                } else {
                    setError(response.message);
                }

                setIsLoading(false);
            }
        );
    }, []);


    const loadTaxonomies = async () => {
        try {
            return await apiFetch({
                path: '/native-custom-fields/v1/term-meta/get-taxonomies',
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
        currentUrl.searchParams.set('taxonomy_slug', row.taxonomy_slug);
        currentUrl.searchParams.set('step', 'edit-or-save-term-meta-fields');
        window.location.href = currentUrl.toString();
    }

    const handleEditOrSaveTaxonomy = (row = null, isEdit = false) => {
        const currentUrl = new URL(window.location.href);
        row && currentUrl.searchParams.set('taxonomy_slug', row.taxonomy_slug);
        currentUrl.searchParams.set('step', 'edit-or-save-taxonomy');
        isEdit && currentUrl.searchParams.set('edit', 'true');
        window.location.href = currentUrl.toString();
    }


    const handleDelete = async (taxonomy_slug) => {
        if (confirm(__('Are you sure you want to delete this taxonomy?', 'native-custom-fields'))) {
            try {
                setIsDeleting(taxonomy_slug);
                const response = await apiFetch({
                    path: `/native-custom-fields/v1/term-meta/delete-taxonomy`,
                    method: 'DELETE',
                    data: {
                        taxonomy_slug: taxonomy_slug,
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

    const handleSaveToDatabase = async (taxonomy_slug) => {
        if (confirm(__('Are you sure you want to copy this taxonomy in to database?', 'native-custom-fields'))) {
            try {
                setIsSavingToDatabase(taxonomy_slug);
                const response = await apiFetch({
                    path: `/native-custom-fields/v1/term-meta/save-taxonomy-to-database`,
                    method: 'POST',
                    data: {
                        taxonomy_slug: taxonomy_slug,
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
        {key: 'taxonomy', label: __('Name', 'native-custom-fields')},
        {key: 'taxonomy_slug', label: __('Slug', 'native-custom-fields')},
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
							onClick={() => handleEditOrSaveTaxonomy(row, true)}
						>
							{__('Edit', 'native-custom-fields')}
						</Button>
                        <AddOrEditFieldsButton row={row} handleAddFields={handleAddFields}/>
						<Button
							variant="secondary"
							icon={trash}
							onClick={() => handleDelete(row.taxonomy_slug)}
							isDestructive
							isBusy={isDeleting === row.taxonomy_slug}
						>
							{isDeleting === row.taxonomy_slug ? __('Deleting', 'native-custom-fields') : __('Delete', 'native-custom-fields')}
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
            title={__('Taxonomies & Term Meta Fields', 'native-custom-fields')}
            buttons={
                (<Button
                    variant="primary"
                    icon={plus}
                    onClick={() => handleEditOrSaveTaxonomy(null, false)}
                >
                    {__('Create Taxonomy', 'native-custom-fields')}
                </Button>)
            }
        />

        <Table
            columns={columns}
            data={taxonomies}
            isLoading={isLoading}
            emptyMessage={
                <Flex direction="column" align="center" gap={4}>
                    <Icon icon={page} size={50}/>
                    <Text variant="title.small">
                        {__('No taxonomies found.', 'native-custom-fields')}
                    </Text>
                    <Text>
                        {__('Create your first taxonomy to get started.', 'native-custom-fields')}
                    </Text>
                </Flex>
            }
        />
    </>);
}

export default TaxonomyListTable;
