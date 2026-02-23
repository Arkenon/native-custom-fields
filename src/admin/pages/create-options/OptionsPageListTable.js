import {__} from '@wordpress/i18n';
import {
	Button,
	Flex,
	__experimentalText as Text,
	Notice,
	Icon
} from '@wordpress/components';
import {plus, commentEditLink, trash, page, postList} from '@wordpress/icons';
import {Header, Table} from "@nativecustomfields/components/index.js";
import {useEffect, useState} from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const OptionsPageListTable = () => {

	const [isOptionsPagesLoading, setIsOptionsPagesLoading] = useState(true);
	const [error, setError] = useState(null);
	const [optionsPages, setOptionsPages] = useState([]);
	const [isOptionsPageDeleting, setIsOptionsPageDeleting] = useState(null);

	useEffect(() => {
		loadOptionsPages().then(
			(response) => {
				if (response.status) {
					setOptionsPages(response.options_menu_list);
					setError(null);
				} else {
					setError(response.message);
				}
			}
		);
	}, []);

	const loadOptionsPages = async () => {
		try {
			return await apiFetch({
				path: '/native-custom-fields/v1/options/get-options-pages',
				method: 'GET'
			});

		} catch (err) {
			setError(err.message);
		} finally {
			setIsOptionsPagesLoading(false);
		}
	};

	const handleAddFields = (row) => {
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('menu_slug', row.menu_slug);
		currentUrl.searchParams.set('step', 'edit-or-save-fields');
		window.location.href = currentUrl.toString();
	}


	const handleEditOrSaveMenuPage = (row = null, isEdit = false) => {
		const currentUrl = new URL(window.location.href);
		row && currentUrl.searchParams.set('menu_slug', row.menu_slug);
		currentUrl.searchParams.set('step', 'edit-or-save-menu-page');
		isEdit && currentUrl.searchParams.set('edit', 'true');
		window.location.href = currentUrl.toString();
	}

	const handleDeleteOptionsPage = async (menu_slug) => {
		if (confirm(__('Are you sure you want to delete this options page?', 'native-custom-fields'))) {
			try {
				setIsOptionsPageDeleting(menu_slug);
				const response = await apiFetch({
					path: `/native-custom-fields/v1/options/delete-options-page`,
					method: 'DELETE',
					data: {
						menu_slug: menu_slug,
					}
				});
				setIsOptionsPageDeleting(null);
				if (response.status) {
					setOptionsPages(optionsPages.filter((row) => row.menu_slug !== menu_slug));
					setError(null);
				} else {
					setError(response.message);
				}
			} catch (error) {
				setError(error.message);
			}
		}
	};


	const optionsPagesColumns = [
		{key: 'no', label: __('No', 'native-custom-fields'),},
		{key: 'menu_name', label: __('Menu Name', 'native-custom-fields')},
		{key: 'menu_slug', label: __('Menu Slug', 'native-custom-fields')},
		{
			key: 'actions',
			label: __('Actions', 'native-custom-fields'),
			className: 'column-actions',
			render: (row) => (<div className="native-custom-fields-table-actions">
				{
					row.created_by === 'native_custom_fields' ?
						<>
							<Button
								variant="secondary"
								icon={commentEditLink}
								onClick={() => handleEditOrSaveMenuPage(row, true)}
							>
								{__('Edit', 'native-custom-fields')}
							</Button>
							<Button
								variant="secondary"
								icon={postList}
								onClick={() => handleAddFields(row)}
							>
								{__('Fields', 'native-custom-fields')}
							</Button>
							<Button
								variant="tertiary"
								icon={trash}
								onClick={() => handleDeleteOptionsPage(row.menu_slug)}
								isDestructive
								isBusy={isOptionsPageDeleting === row.menu_slug}
							>
								{
									isOptionsPageDeleting ? __('Deleting', 'native-custom-fields') : __('Delete', 'native-custom-fields')
								}
							</Button>
						</>
						:
						<p>{__('Options pages created by external plugin cannot be edited or deleted.', 'native-custom-fields')}</p>
				}
			</div>)
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

		{/*Options Pages*/}
		<Header
			title={__('Options Pages', 'native-custom-fields')}
			buttons={
				(<Button
					variant="primary"
					icon={plus}
					onClick={() => handleEditOrSaveMenuPage(null, false)}
				>
					{__('Create Options Page', 'native-custom-fields')}
				</Button>)
			}
		/>

		<Table
			columns={optionsPagesColumns}
			data={optionsPages}
			isLoading={isOptionsPagesLoading}
			emptyMessage={
				<Flex direction="column" align="center" gap={4}>
					<Icon icon={page} size={50}/>
					<Text variant="title.small">
						{__('No options page found.', 'native-custom-fields')}
					</Text>
					<Text>
						{__('Create your first options page to get started.', 'native-custom-fields')}
					</Text>
				</Flex>
			}
		/>
	</>);
}

export default OptionsPageListTable;
