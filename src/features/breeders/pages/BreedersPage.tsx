import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, message, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined, KeyOutlined } from '@ant-design/icons';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBreeders, useBreeder, useUpdateBreeder, useDeleteBreeder, useCreateBreeder, type Breeder } from '../api/breeders';
import dayjs from 'dayjs';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import { UserRoles } from '../../users/types';
import { ChangePasswordModal } from '../../auth/components/ChangePasswordModal';

const breederSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email'),
    role: z.string().min(1, 'Role is required'),
    status: z.string().min(1, 'Status is required'),
});

const createBreederSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    phoneNumber: z.string().min(1, 'Phone Number is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().min(1, 'Role is required'),
});

type BreederSchema = z.infer<typeof breederSchema>;
type CreateBreederSchema = z.infer<typeof createBreederSchema>;

export const BreedersPage: React.FC = () => {
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

    // Fetch Breeders with search
    const { data: breedersResponse, isLoading } = useBreeders(debouncedSearch);
    const breeders = breedersResponse?.data || [];

    // Local State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
    const [selectedBreederId, setSelectedBreederId] = useState<number | null>(null);

    // Fetch Single Breeder
    const { data: singleBreederResponse, isLoading: isLoadingSingleBreeder } = useBreeder(selectedBreederId);
    const singleBreeder = singleBreederResponse?.data;

    // Mutations
    const { mutate: updateBreeder, isPending: isUpdating } = useUpdateBreeder();
    const { mutate: deleteBreeder } = useDeleteBreeder();
    const { mutate: createBreeder, isPending: isCreating } = useCreateBreeder();

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<BreederSchema>({
        resolver: zodResolver(breederSchema),
    });

    const { control: createControl, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm<CreateBreederSchema>({
        resolver: zodResolver(createBreederSchema),
    });

    // When singleBreeder data is fetched, populate the form
    useEffect(() => {
        if (singleBreeder && isEditModalOpen) {
            reset({
                firstName: singleBreeder.firstName,
                lastName: singleBreeder.lastName,
                email: singleBreeder.email,
                role: singleBreeder.role,
                status: singleBreeder.status,
            });
        }
    }, [singleBreeder, isEditModalOpen, reset]);

    const handleEditClick = (id: number) => {
        setSelectedBreederId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedBreederId(null);
        reset({ firstName: '', lastName: '', email: '', role: '', status: '' });
    };

    const handleDeleteClick = (id: number) => {
        setSelectedBreederId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedBreederId) {
            deleteBreeder(selectedBreederId, {
                onSuccess: () => {
                    message.success('Breeder deleted successfully');
                    setIsDeleteModalOpen(false);
                    setSelectedBreederId(null);
                },
                onError: () => {
                    message.error('Failed to delete breeder');
                }
            });
        }
    };

    const onSubmitEdit = (data: BreederSchema) => {
        if (selectedBreederId) {
            updateBreeder({ id: selectedBreederId, data: { ...data } }, {
                onSuccess: () => {
                    message.success('Breeder updated successfully');
                    handleCloseEditModal();
                },
                onError: () => {
                    message.error('Failed to update breeder');
                }
            });
        }
    };

    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        resetCreate();
        resetCreate();
    };

    const handleChangePasswordClick = (email: string) => {
        setSelectedUserEmail(email);
        setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setSelectedUserEmail('');
    };

    const onSubmitCreate = (data: CreateBreederSchema) => {
        createBreeder(data, {
            onSuccess: () => {
                message.success('Breeder created successfully');
                handleCloseCreateModal();
            },
            onError: () => {
                message.error('Failed to create breeder');
            }
        });
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
            render: (text: string, record: Breeder) => (
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
            title: 'Creation DATE',
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
            render: (_: any, record: Breeder) => {
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
                    {
                        key: 'change-password',
                        icon: <KeyOutlined />,
                        label: 'Change Password',
                        onClick: () => handleChangePasswordClick(record.email),
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
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Breeders </h1>

                    <SearchBar
                        className="w-96 border-none ml-5"
                        placeholder="Search Breeders..."
                        onSearch={(val: string) => setSearchQuery(val)}
                    />
                </div>
                <CustomButton
                    onClick={handleCreateClick}
                    className="h-11! px-6! rounded-lg "
                >
                    <PlusOutlined />
                    Create Breeder
                </CustomButton>
            </div>
            <GenericTable
                columns={columns}
                data={breeders}
                loading={isLoading}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Breeder"
            >
                {isLoadingSingleBreeder ? (
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
                                { label: 'User', value: UserRoles.User },
                                { label: 'Vendor', value: UserRoles.Vendor },
                                { label: 'Breeder', value: UserRoles.Breeder },
                                { label: 'Admin', value: UserRoles.Admin },
                                { label: 'Veterinary', value: UserRoles.Veterinary },
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

            {/* Create Breeder Modal */}
            <GenericModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                title="Create Breeder"
            >
                <form onSubmit={handleCreateSubmit(onSubmitCreate)} className="space-y-4">
                    <CustomInput label="First Name" name="firstName" control={createControl} placeholder="First Name" />
                    <CustomInput label="Last Name" name="lastName" control={createControl} placeholder="Last Name" />
                    <CustomInput label="Phone Number" name="phoneNumber" control={createControl} placeholder="Phone Number" />
                    <CustomInput label="Email" name="email" control={createControl} placeholder="Email" type="email" />
                    <CustomInput label="Password" name="password" control={createControl} placeholder="Password" type="password" />
                    <CustomSelect
                        label="Role"
                        name="role"
                        control={createControl}
                        placeholder="Select Role"
                        options={[
                            { label: 'User', value: UserRoles.User },
                            { label: 'Vendor', value: UserRoles.Vendor },
                            { label: 'Breeder', value: UserRoles.Breeder },
                            { label: 'Admin', value: UserRoles.Admin },
                            { label: 'Veterinary', value: UserRoles.Veterinary },
                        ]}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseCreateModal}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <CustomButton
                            htmlType="submit"
                            loading={isCreating}
                            disabled={isCreating}
                            variant="primary"
                            className="h-10! px-4! rounded-lg"
                        >
                            Create Breeder
                        </CustomButton>
                    </div>
                </form>
            </GenericModal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this breeder?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={handleCloseChangePasswordModal}
                email={selectedUserEmail}
            />
        </>
    );
};
