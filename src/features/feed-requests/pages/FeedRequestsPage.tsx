import React, { useState } from 'react';
import { Dropdown, Button } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FeedRequest } from '../types';


// Mock Data
const mockRequests: FeedRequest[] = [
    { id: 'ABC34', userName: 'Christine Brooks', email: 'contact@abc.com', subject: 'Account Activation', received: '30 min ago', status: 'New' },
    { id: 'DEF56', userName: 'Darrell Caldwell', email: 'support@xyzltd.com', subject: 'Account Creation Vetinery', received: '1 hour ago', status: 'Open' },
    { id: 'JKL90', userName: 'Rosie Pearson', email: 'support@defllc.com', subject: 'Account Creation Breeders', received: '3 hours ago', status: 'In Progress' },
    { id: 'MNO12', userName: 'Mixwell Iskam', email: 'support@lmninc.com', subject: 'Account Activation', received: '4 hours ago', status: 'Close' },
    { id: 'GHI78', userName: 'Saqib Ali', email: 'contact@abc.com', subject: 'Account Creation Vendor', received: '2 hours ago', status: 'Open' },
    { id: 'DEF56', userName: 'Alan Cain', email: 'support@lmninc.com', subject: 'Account Activation', received: '6 hours ago', status: 'In Progress' },
    { id: 'STU56', userName: 'Alex Mill', email: 'support@xyzltd.com', subject: 'Account Creation Breeders', received: '7 hours ago', status: 'Open' },
    { id: 'VWX78', userName: 'Killweex Chill', email: 'support@lmninc.com', subject: 'Account Creation Vendor', received: '8 hours ago', status: 'Open' },
    { id: 'YZA90', userName: 'Johnston William', email: 'support@defllc.com', subject: 'Account Creation Vetinery', received: '5 hours ago', status: 'Open' },
    { id: 'PQR34', userName: 'Miller Salon', email: 'support@xyzltd.com', subject: 'Account Activation', received: '9 hours ago', status: 'Close' },
    { id: 'BCD12', userName: 'Gilbert Johnston', email: 'contact@abc.com', subject: 'Account Creation Vetinery', received: '9 hours ago', status: 'Open' },
];

const requestSchema = z.object({
    userName: z.string().min(1, 'User Name is required'),
    email: z.string().email('Invalid email'),
    subject: z.string().min(1, 'Subject is required'),
    received: z.string().min(1, 'Received time/date is required'),
    status: z.enum(['New', 'Open', 'In Progress', 'Close']),
});

type RequestSchema = z.infer<typeof requestSchema>;

export const FeedRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<FeedRequest[]>(mockRequests);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<FeedRequest | null>(null);

    const { control, handleSubmit, reset, setValue } = useForm<RequestSchema>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            userName: '',
            email: '',
            subject: '',
            received: '',
            status: 'New',
        }
    });

    const handleCreateClick = () => {
        setSelectedRequest(null);
        reset({
            userName: '',
            email: '',
            subject: '',
            received: 'Just now', // Default for new requests
            status: 'New',
        });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (request: FeedRequest) => {
        setSelectedRequest(request);
        setValue('userName', request.userName);
        setValue('email', request.email);
        setValue('subject', request.subject);
        setValue('received', request.received);
        setValue('status', request.status);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (request: FeedRequest) => {
        setSelectedRequest(request);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedRequest) {
            setRequests(requests.filter(r => r.id !== selectedRequest.id));
            setIsDeleteModalOpen(false);
            setSelectedRequest(null);
        }
    };

    const onSubmitEdit = (data: RequestSchema) => {
        if (selectedRequest) {
            setRequests(requests.map(r => (r.id === selectedRequest.id ? { ...r, ...data } : r)));
        } else {
            const newRequest: FeedRequest = {
                id: Math.random().toString(36).substr(2, 5).toUpperCase(),
                ...data,
            };
            setRequests([newRequest, ...requests]);
        }
        setIsEditModalOpen(false);
        setSelectedRequest(null);
        reset();
    };

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            render: (text: string) => (
                <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800">{text}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Received',
            dataIndex: 'received',
            key: 'received',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let className = "px-3 py-1 rounded-full text-xs font-medium ";
                if (status === 'New') className += "bg-blue-50 text-blue-600";
                if (status === 'Open') className += "bg-yellow-50 text-yellow-600";
                if (status === 'In Progress') className += "bg-red-50 text-red-600";
                if (status === 'Close') className += "bg-green-50 text-green-600";

                return <span className={className}>● {status}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: FeedRequest) => {
                const menuItems = [
                    {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Edit',
                        onClick: () => handleEditClick(record),
                    },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        label: 'Delete',
                        danger: true,
                        onClick: () => handleDeleteClick(record),
                    },
                ];

                return (
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <div className="cursor-pointer flex justify-center w-8 h-8 items-center rounded-full hover:bg-gray-100">
                            <MoreOutlined className="text-xl" />
                        </div>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <div className="flex items-center mb-6 justify-between flex-wrap">
                <div className="flex md:items-center flex-col md:flex-row">
                    <h1 className="text-2xl font-bold text-gray-800">Requests</h1>
                    <SearchBar className="md:ml-5 md:w-96 border-none my-3 md:my-0" onSearch={(val: string) => console.log(val)} />
                </div>
                <Button
                    icon={<PlusOutlined />}
                    className=" bg-buttonbgcolor! text-white! border-none! hover:bg-[#8f5de8]! h-11! px-6 font-semibold rounded-lg shadow-sm"
                    onClick={handleCreateClick}
                >
                    Create Request
                </Button>
            </div>

            <GenericTable
                columns={columns}
                data={requests}
                loading={false}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={selectedRequest ? "Edit Request" : "Create Request"}
            >
                <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                    <CustomInput label="User Name" name="userName" control={control} placeholder="User Name" />
                    <CustomInput label="Email" name="email" control={control} placeholder="Email" />
                    <CustomInput label="Subject" name="subject" control={control} placeholder="Subject" />

                    {/* For received date, we might want a real date picker if we want to change it manually, 
                        or just a text input for simulation since the mock data is relative strings '30 min ago'.
                        I'll leave it as text for flexible input to match mock data mostly. */}
                    <CustomInput label="Received" name="received" control={control} placeholder="e.g. 30 min ago" />

                    <CustomSelect
                        label="Status"
                        name="status"
                        control={control}
                        placeholder="Select Status"
                        options={[
                            { label: 'New', value: 'New' },
                            { label: 'Open', value: 'Open' },
                            { label: 'In Progress', value: 'In Progress' },
                            { label: 'Close', value: 'Close' },
                        ]}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#A26CF7] text-white hover:bg-[#8f5de8] transition-colors shadow-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </GenericModal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this request?"
                confirmText="Confirm"
            />
        </>
    );
};
