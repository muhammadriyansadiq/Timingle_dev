import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface GenericTableProps<T> extends TableProps<T> {
    data: T[];
    loading?: boolean;
}

export const GenericTable = <T extends object>({
    data,
    loading,
    columns,
    ...props
}: GenericTableProps<T>) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowClassName="hover:bg-gray-50 transition-colors"
                {...props}
            />
        </div>
    );
};
