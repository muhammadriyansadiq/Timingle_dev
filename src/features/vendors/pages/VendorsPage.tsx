import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, message, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
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
import { useVendors, useVendor, useUpdateVendor, useDeleteVendor, type Vendor } from '../api/vendors';
import dayjs from 'dayjs';

const vendorSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email'),
    status: z.enum(['Active', 'Offline', 'Suspended']),
});

type VendorSchema = z.infer<typeof vendorSchema>;

export const VendorsPage: React.FC = () => {
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

    // Fetch Vendors with search
    const { data: vendorsResponse, isLoading } = useVendors(debouncedSearch);
    const vendors = vendorsResponse?.data || [];

    // Local State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

    // Fetch Single Vendor
    const { data: singleVendorResponse, isLoading: isLoadingSingleVendor } = useVendor(selectedVendorId);
    const singleVendor = singleVendorResponse?.data;

    // Mutations
    const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor();
    const { mutate: deleteVendor } = useDeleteVendor();

    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<VendorSchema>({
        resolver: zodResolver(vendorSchema),
    });

    // When singleVendor data is fetched, populate the form
    useEffect(() => {
        if (singleVendor && isEditModalOpen) {
            reset({
                firstName: singleVendor.firstName,
                lastName: singleVendor.lastName,
                email: singleVendor.email,
                status: singleVendor.status as 'Active' | 'Offline' | 'Suspended',
            });
        }
    }, [singleVendor, isEditModalOpen, reset]);

    const handleEditClick = (id: number) => {
        setSelectedVendorId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedVendorId(null);
        reset({ firstName: '', lastName: '', email: '', status: 'Active' });
    };

    const handleDeleteClick = (id: number) => {
        setSelectedVendorId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedVendorId) {
            deleteVendor(selectedVendorId, {
                onSuccess: () => {
                    message.success('Vendor deleted successfully');
                    setIsDeleteModalOpen(false);
                    setSelectedVendorId(null);
                },
                onError: () => {
                    message.error('Failed to delete vendor');
                }
            });
        }
    };

    const onSubmitEdit = (data: VendorSchema) => {
        if (selectedVendorId) {
            updateVendor({ id: selectedVendorId, data: { ...data } }, {
                onSuccess: () => {
                    message.success('Vendor updated successfully');
                    handleCloseEditModal();
                },
                onError: () => {
                    message.error('Failed to update vendor');
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
            render: (text: string, record: Vendor) => (
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

                return <span className={className}>{status}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Vendor) => {
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
            {/* <div className="flex items-center mb-6 justify-between flex-col md:flex-row  gap-2">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Vendors</h1>
                    <SearchBar className="ml-5 w-96 border-none" onSearch={(val: string) => console.log(val)} />
                </div>
                <Button
                    icon={<PlusOutlined />}
                    className=" bg-buttonbgcolor! text-white! border-none! hover:bg-[#8f5de8]! h-11! px-6 font-semibold rounded-lg shadow-sm"
                    onClick={handleCreateClick}
                >
                    Create Vendor
                </Button>
            </div> */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Vendors </h1>

                    <SearchBar
                        className="w-64 border-none md:ml-2"
                        placeholder="Search Vendors..."
                        onSearch={(val: string) => setSearchQuery(val)}
                    />
                </div>
            </div>
            <GenericTable
                columns={columns}
                data={vendors}
                loading={isLoading}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Vendor"
            >
                {isLoadingSingleVendor ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                        <CustomInput label="First Name" name="firstName" control={control} placeholder="First Name" />
                        <CustomInput label="Last Name" name="lastName" control={control} placeholder="Last Name" />
                        <CustomInput label="Email" name="email" control={control} placeholder="Email" />

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
                            <button
                                type="submit"
                                disabled={!isDirty || isUpdating}
                                className="px-4 py-2 rounded-lg bg-[#A26CF7] text-white hover:bg-[#8f5de8] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
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
                message="Are you sure you want to delete this vendor?"
                confirmText="Confirm"
            />
        </>
    );
};
