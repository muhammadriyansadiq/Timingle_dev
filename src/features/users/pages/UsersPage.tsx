import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, message, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsers, useUpdateUser, useDeleteUser, useUser } from '../api/users';
import type { User } from '../api/users';
import { CustomButton } from '../../../shared/components/ui/CustomButton';

const userSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email'),
    role: z.string().min(1, 'Role is required'),
    status: z.string().min(1, 'Status is required'),
});

type UserSchema = z.infer<typeof userSchema>;

export const UsersPage: React.FC = () => {
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 1. Fetch All Users with search
    const { data: usersResponse, isLoading } = useUsers(debouncedSearch);
    // Safely access the data array
    const users = usersResponse?.data || [];

    // Local State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // 2. Fetch Single User (Enabled only when selectedUserId is set)
    const { data: singleUserResponse, isLoading: isLoadingSingleUser } = useUser(selectedUserId);
    const singleUser = singleUserResponse?.data;

    // Mutations
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutate: deleteUser } = useDeleteUser();

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    // When singleUser data is fetched, populate the form
    useEffect(() => {
        if (singleUser && isEditModalOpen) {
            reset({
                firstName: singleUser.firstName,
                lastName: singleUser.lastName,
                email: singleUser.email,
                role: singleUser.role,
                status: singleUser.status,
            });
        }
    }, [singleUser, isEditModalOpen, reset]);

    const handleEditClick = (id: number) => {
        setSelectedUserId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUserId(null); // Reset selection
        reset({ firstName: '', lastName: '', email: '', role: '', status: '' }); // Clear form
    };

    const handleDeleteClick = (id: number) => {
        setSelectedUserId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedUserId) {
            deleteUser(selectedUserId, {
                onSuccess: () => {
                    message.success('User deleted successfully');
                    setIsDeleteModalOpen(false);
                    setSelectedUserId(null);
                },
                onError: () => {
                    message.error('Failed to delete user');
                }
            });
        }
    };

    const onSubmitEdit = (data: UserSchema) => {
        if (selectedUserId) {
            updateUser({ id: selectedUserId, data: { ...data } }, {
                onSuccess: () => {
                    message.success('User updated successfully');
                    handleCloseEditModal();
                },
                onError: () => {
                    message.error('Failed to update user');
                }
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'NAME',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text: string, record: User) => (
                <div className="flex items-center gap-3">
                    <Avatar icon={<UserOutlined />} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${text}`} />
                    <span className="font-medium text-gray-800">{text} {record.lastName}</span>
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
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'TYPE',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let className = "px-3 py-2 rounded-lg text-xs font-normal ";
                if (status === 'Active') className += "bg-green-100 text-green-600";
                if (status === 'Offline') className += "bg-purple-100 text-purple-600";
                if (status === 'Suspended') className += "bg-red-100 text-red-600";
                if (!['Active', 'Offline', 'Suspended'].includes(status)) className += "bg-gray-100 text-gray-600";

                return <span className={className}>{status}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: User) => {
                const menuItems = [
                    {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Edit',
                        onClick: () => handleEditClick(record.id),
                    },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        label: 'Delete',
                        danger: true,
                        onClick: () => handleDeleteClick(record.id),
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
            <div className="flex  items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <SearchBar
                    className="w-96 border-none ml-5"
                    onSearch={(val: string) => setSearchQuery(val)}
                    placeholder="Search users..."
                />
            </div>

            <GenericTable
                columns={columns}
                data={users}
                loading={isLoading}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Edit User"
            >
                {/* Show spinner while fetching single user data */}
                {isLoadingSingleUser ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                        <CustomInput label="Name" name="firstName" control={control} placeholder="First Name" />
                        <CustomInput label="Last Name" name="lastName" control={control} placeholder="Last Name" />
                        <CustomInput label="Email" name="email" control={control} placeholder="Email" />
                        <CustomSelect
                            label="Type"
                            name="role"
                            control={control}
                            placeholder="Select Role"
                            options={[
                                { label: 'User', value: 'User' },
                                { label: 'Vendor', value: 'Vendor' },
                                { label: 'Admin', value: 'Admin' },
                            ]}
                        />

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
                                onClick={handleCloseEditModal}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <CustomButton
                                htmlType="submit"
                                loading={isUpdating}
                                disabled={!isDirty || isUpdating}
                                variant="primary"
                                className="h-10! px-4! rounded-lg"
                            >
                                Save Changes
                            </CustomButton>
                        </div>
                    </form>
                )}
            </GenericModal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this user?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};
