import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

function Table({ columns, data, isLoading, emptyMessage }) {
    if (isLoading) {
        return (
            <div className="native-custom-fields-table-loading">
                <Spinner />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="native-custom-fields-table-empty">
                <p>{emptyMessage || __('No data found', 'native-custom-fields')}</p>
            </div>
        );
    }

    return (
        <div className="native-custom-fields-table-wrapper">
            <table className="native-custom-fields-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className={column.className}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id || rowIndex}>
                            {columns.map((column) => (
                                <td key={column.key} className={column.className}>
                                    {column.render ? column.render(row) : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table; 