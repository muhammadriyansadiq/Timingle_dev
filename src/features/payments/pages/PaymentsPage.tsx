import React, { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { FinancialsCards } from '../components/FinancialsCards';
import type { PaymentTransaction } from '../types';

// Mock Data
const mockTransactions: PaymentTransaction[] = [
    { id: 'INV-1748622537669', name: 'John Smith', email: 'contact@abc.com', method: 'Promote listing', price: '$18.00 USD', date: '5/30/2025', status: 'Paid' },
    { id: 'INV-1748622544307', name: 'Sarah Johnson', email: 'support@xyzltd.com', method: 'Promote Profile', price: '$12.00 USD', date: '5/30/2025', status: 'Pending' },
    { id: 'INV-1748622539278', name: 'Emily Davis', email: 'support@defllc.com', method: 'Promote listing', price: '$18.00 USD', date: '5/30/2025', status: 'Paid' },
    { id: 'INV-1748622539278', name: 'David Wilson', email: 'support@lmninc.com', method: 'Promote Profile', price: '$18.00 USD', date: '5/30/2025', status: 'Overdue' },
    { id: 'INV-1748622537669', name: 'John Smith', email: 'contact@abc.com', method: 'Promote listing', price: '$18.00 USD', date: '5/30/2025', status: 'Paid' },
    { id: 'INV-1748622544307', name: 'Sarah Johnson', email: 'support@xyzltd.com', method: 'Promote Profile', price: '$12.00 USD', date: '5/30/2025', status: 'Pending' },
];

export const PaymentsPage: React.FC = () => {
    const [transactions] = useState<PaymentTransaction[]>(mockTransactions);
    const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (transaction: PaymentTransaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let className = "font-medium ";
                if (status === 'Paid') className += "text-green-500";
                if (status === 'Pending') className += "text-orange-400";
                if (status === 'Overdue') className += "text-red-500";

                return <span className={className}>{status}</span>;
            },
        },
        {
            title: 'Details',
            key: 'details',
            render: (_: any, record: PaymentTransaction) => (
                <button
                    onClick={() => handleViewDetails(record)}
                    className="p-2 text-gray-500 hover:text-[#A26CF7] hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
                    title="View Details"
                >
                    <EyeOutlined className="text-lg" />
                </button>
            ),
        },
    ];

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Financials</h1>
                <FinancialsCards />

                <div className="mt-12">
                    <div className="flex items-center mb-7">
                        <div className='flex justify-between md:items-center flex-col md:flex-row'>
                            <h2 className="text-2xl font-bold text-gray-800">Financial Transactions</h2>
                            <SearchBar className="w-72 border border-gray-200 md:mx-5 my-3 md:my-0" onSearch={(val: string) => console.log(val)} />
                            <div className="flex gap-2">
                                {/* Placeholder for status filter if needed, matching design input style optionally */}
                                <select className="border border-gray-200 rounded-lg px-3 py-3 cursor-pointer text-sm bg-white focus:outline-none">
                                    <option>All</option>
                                    <option>Paid</option>
                                    <option>Pending</option>
                                    <option>Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <GenericTable
                        columns={columns}
                        data={transactions}
                        loading={false}
                        rowKey={(record) => record.id + Math.random()} // unique key since IDs repeat in mock
                    />
                </div>
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Transaction Details"
            >
                {selectedTransaction && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Transaction ID</label>
                                <p className="text-sm font-medium text-gray-900 mt-1">{selectedTransaction.id}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</label>
                                <p className="text-sm font-medium text-gray-900 mt-1">{selectedTransaction.date}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">User Details</label>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                        {selectedTransaction.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedTransaction.name}</p>
                                        <p className="text-xs text-gray-500">{selectedTransaction.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Method</label>
                                <p className="text-sm font-medium text-gray-900 mt-1">{selectedTransaction.method}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</label>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${selectedTransaction.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                            selectedTransaction.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-900">{selectedTransaction.price}</span>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-[#A26CF7] text-white rounded-lg hover:bg-[#8f5de8] transition-colors text-sm font-medium"
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                )}
            </GenericModal>
        </>
    );
};
