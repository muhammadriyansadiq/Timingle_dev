import React, { useState } from 'react';
import { Dropdown, Avatar, DatePicker } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Mock Data
const mockUsers = [
    { id: '00001', name: 'Christine Brooks', email: 'user1@gmail.com', date: '14 Feb 2025', type: 'User', status: 'Active' },
    { id: '00002', name: 'Rosie Pearson', email: 'user2@gmail.com', date: '14 Feb 2025', type: 'User', status: 'Offline' },
    { id: '00003', name: 'Darrell Caldwell', email: 'user3@gmail.com', date: '14 Feb 2025', type: 'User', status: 'Suspended' },
    { id: '00004', name: 'Gilbert Johnston', email: 'user4@gmail.com', date: '14 Feb 2025', type: 'User', status: 'Active' },
    { id: '00005', name: 'Alan Cain', email: 'user5@gmail.com', date: '14 Feb 2025', type: 'User', status: 'Offline' },
];

const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    type: z.string().min(1, 'Type is required'),
    date: z.string().min(1, 'Date is required'),
    status: z.string().min(1, 'Status is required'),
});

type UserSchema = z.infer<typeof userSchema>;

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState(mockUsers);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { control, handleSubmit, reset, setValue } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setValue('name', user.name);
        setValue('email', user.email);
        setValue('type', user.type);
        setValue('date', user.date);
        setValue('status', user.status);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user: any) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    // Disable dates logic
    const disabledDate = (current: dayjs.Dayjs) => {
        // If editing, disable dates before the original date
        const minDate = selectedUser && selectedUser.date
            ? dayjs(selectedUser.date)
            : dayjs();

        return current && current < minDate.startOf('day');
    };

    const onSubmitEdit = (data: UserSchema) => {
        setUsers(users.map(u => (u.id === selectedUser.id ? { ...u, ...data } : u)));
        setIsEditModalOpen(false);
        setSelectedUser(null);
        reset();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <div className="flex items-center gap-3">
                    <Avatar icon={<UserOutlined />} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${text}`} />
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
            title: 'DATE',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'TYPE',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                // Custom styles to match the image precisely would need custom classes or style objects
                // For now, standard Ant Tag colors or custom classes
                let className = "px-3 py-2 rounded-lg text-xs font-normal ";
                if (status === 'Active') className += "bg-green-100 text-green-600";
                if (status === 'Offline') className += "bg-purple-100 text-purple-600";
                if (status === 'Suspended') className += "bg-red-100 text-red-600";

                return <span className={className}>{status}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => {
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <SearchBar className="w-96 border-none" onSearch={(val: string) => console.log(val)} />
            </div>

            <GenericTable
                columns={columns}
                data={users}
                loading={false}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit User"
            >
                <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                    <CustomInput label="Name" name="name" control={control} placeholder="Name" />
                    <CustomInput label="Email" name="email" control={control} placeholder="Email" />
                    <CustomSelect
                        label="Type"
                        name="type"
                        control={control}
                        placeholder="Select Type"
                        options={[
                            { label: 'User', value: 'User' },
                            { label: 'Admin', value: 'Admin' },
                        ]}
                    />
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-medium text-gray-700">Date</label>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <DatePicker
                                    className="w-full h-11 rounded-lg border-gray-200"
                                    format="DD MMM YYYY"
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => field.onChange(date ? date.format('DD MMM YYYY') : '')}
                                    disabledDate={disabledDate}
                                />
                            )}
                        />
                    </div>
                    <CustomSelect
                        label="Status"
                        name="status"
                        control={control}
                        placeholder="Select Status"
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Offline', value: 'Offline' },
                            { label: 'Suspended', value: 'Suspended' },
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
                message="Are you sure you want to delete this user?"
                confirmText="Confirm"
            />
        </>
    );
};
