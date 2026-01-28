import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, message, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVeterinaries, useVeterinary, useUpdateVeterinary, useDeleteVeterinary, useCreateVeterinary, type Veterinary } from '../api/veterinary';
import dayjs from 'dayjs';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import { UserRoles } from '../../users/types';

const veterinarySchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email'),
    role: z.string().min(1, 'Role is required'),
    status: z.string().min(1, 'Status is required'),
});

const createVeterinarySchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    phoneNumber: z.string().min(1, 'Phone Number is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().min(1, 'Role is required'),
});

type VeterinarySchema = z.infer<typeof veterinarySchema>;
type CreateVeterinarySchema = z.infer<typeof createVeterinarySchema>;

export const VeterinaryListPage: React.FC = () => {
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

    // Fetch Veterinaries with search
    const { data: veterinariesResponse, isLoading } = useVeterinaries(debouncedSearch);
    const veterinaries = veterinariesResponse?.data || [];

    // Local State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null);

    // Fetch Single Veterinary
    const { data: singleVetResponse, isLoading: isLoadingSingleVet } = useVeterinary(selectedVetId);
    const singleVet = singleVetResponse?.data;

    // Mutations
    const { mutate: updateVeterinary, isPending: isUpdating } = useUpdateVeterinary();
    const { mutate: deleteVeterinary } = useDeleteVeterinary();
    const { mutate: createVeterinary, isPending: isCreating } = useCreateVeterinary();

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<VeterinarySchema>({
        resolver: zodResolver(veterinarySchema),
    });

    const { control: createControl, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm<CreateVeterinarySchema>({
        resolver: zodResolver(createVeterinarySchema),
    });

    // When singleVet data is fetched, populate the form
    useEffect(() => {
        if (singleVet && isEditModalOpen) {
            reset({
                firstName: singleVet.firstName,
                lastName: singleVet.lastName,
                email: singleVet.email,
                role: singleVet.role,
                status: singleVet.status,
            });
        }
    }, [singleVet, isEditModalOpen, reset]);

    const handleEditClick = (id: number) => {
        setSelectedVetId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedVetId(null);
        reset({ firstName: '', lastName: '', email: '', role: '', status: '' });
    };

    const handleDeleteClick = (id: number) => {
        setSelectedVetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedVetId) {
            deleteVeterinary(selectedVetId, {
                onSuccess: () => {
                    message.success('Veterinary deleted successfully');
                    setIsDeleteModalOpen(false);
                    setSelectedVetId(null);
                },
                onError: () => {
                    message.error('Failed to delete veterinary');
                }
            });
        }
    };

    const onSubmitEdit = (data: VeterinarySchema) => {
        if (selectedVetId) {
            updateVeterinary({ id: selectedVetId, data: { ...data } }, {
                onSuccess: () => {
                    message.success('Veterinary updated successfully');
                    handleCloseEditModal();
                },
                onError: () => {
                    message.error('Failed to update veterinary');
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
    };

    const onSubmitCreate = (data: CreateVeterinarySchema) => {
        createVeterinary(data, {
            onSuccess: () => {
                message.success('Veterinary created successfully');
                handleCloseCreateModal();
            },
            onError: () => {
                message.error('Failed to create veterinary');
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
            render: (text: string, record: Veterinary) => (
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
            render: (_: any, record: Veterinary) => {
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
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Veterinary List </h1>

                    <SearchBar
                        className="w-96 border-none ml-5"
                        placeholder="Search Veterinary..."
                        onSearch={(val: string) => setSearchQuery(val)}
                    />
                </div>
                <CustomButton
                    onClick={handleCreateClick}
                    className="h-11! px-6! rounded-lg "
                >
                    <PlusOutlined />
                    Create Veterinary
                </CustomButton>
            </div>
            <GenericTable
                columns={columns}
                data={veterinaries}
                loading={isLoading}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Veterinary"
            >
                {isLoadingSingleVet ? (
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

            {/* Create Veterinary Modal */}
            <GenericModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                title="Create Veterinary"
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
                            Create Veterinary
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
                message="Are you sure you want to delete this veterinary?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};
