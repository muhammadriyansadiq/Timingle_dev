import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, message, Spin } from 'antd';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { FilterOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useFeaturedListings, useFeaturedListing, useUpdateFeaturedListing, useDeleteFeaturedListing } from '../api/featuredListing';
import type { FeaturedListingFilters, FeaturedListing, UpdateFeaturedListingPayload } from '../types';
import { useUsers } from '../../users/api/users';
import { FeaturedListingFilterModal } from '../components/FeaturedListingFilterModal';


export const FeaturedListingPage: React.FC = () => {
    // Filter State
    const [filters, setFilters] = useState<FeaturedListingFilters>({
        page: 1,
        limit: 10,
        lang: 'ur', // Default as per request
    });

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Fetch Data
    const { data: listingResponse, isLoading } = useFeaturedListings(filters);
    const listings = listingResponse?.data || [];

    // Fetch Users for Filter Select
    const { data: usersResponse } = useUsers();
    const users = usersResponse?.data || [];
    const userOptions = users.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u.id }));



    const handleFilterSubmit = (data: FeaturedListingFilters) => {
        // Remove empty values and convert types
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != null && v !== '')
        ) as any;

        if (cleanData.minPrice) cleanData.minPrice = Number(cleanData.minPrice);
        if (cleanData.maxPrice) cleanData.maxPrice = Number(cleanData.maxPrice);

        // Create new filters object, preserving pagination defaults but overriding everything else
        const newFilters: FeaturedListingFilters = {
            page: 1, // Reset to page 1 on new filter
            limit: filters.limit || 10,
            lang: filters.lang || 'ur',
            ...cleanData
        };

        setFilters(newFilters);
        setIsFilterModalOpen(false);
    };



    // Modals & Selection State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Fetch Single Listing (for Edit)
    const { data: singleListingResponse, isLoading: isLoadingSingle } = useFeaturedListing(selectedId);
    const singleListing = singleListingResponse?.data;

    // Mutations
    const { mutate: updateListing, isPending: isUpdating } = useUpdateFeaturedListing();
    const { mutate: deleteListing } = useDeleteFeaturedListing();

    // Edit Form
    const { control, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateFeaturedListingPayload>();

    // Populate Edit Form
    useEffect(() => {
        if (singleListing && isEditModalOpen) {
            reset({
                petName: singleListing.petName,
                type: singleListing.type,
                price: Number(singleListing.price),
                status: singleListing.status,
                description: singleListing.description || '',
                userId: singleListing.userId,
            });
        }
    }, [singleListing, isEditModalOpen, reset]);

    const handleEditClick = (id: number) => {
        setSelectedId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedId(null);
        reset();
    };

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            deleteListing(selectedId, {
                onSuccess: () => {
                    message.success('Listing deleted successfully');
                    setIsDeleteModalOpen(false);
                    setSelectedId(null);
                },
                onError: () => {
                    message.error('Failed to delete listing');
                }
            });
        }
    };

    const onSubmitEdit = (data: UpdateFeaturedListingPayload) => {
        if (selectedId) {
            updateListing({ id: selectedId, data }, {
                onSuccess: () => {
                    message.success('Listing updated successfully');
                    handleCloseEditModal();
                },
                onError: () => {
                    message.error('Failed to update listing');
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
            title: 'Pet Name',
            dataIndex: 'petName',
            key: 'petName',
            render: (text: string, record: FeaturedListing) => (
                <div className="flex items-center gap-3">
                    {record.image ? (
                        <Avatar src={record.image} shape="square" size="large" />
                    ) : (
                        <Avatar shape="square" size="large">{text?.charAt(0)}</Avatar>
                    )}
                    <span className="font-medium text-gray-800">{text}</span>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Owner',
            dataIndex: ['user', 'firstName'], // nested access
            key: 'owner',
            render: (_: any, record: FeaturedListing) => (
                <span>{record.user?.firstName} {record.user?.lastName}</span>
            )
        },
        {
            title: 'Owner Role',
            dataIndex: ['user', 'role'],
            key: 'role',
        },
        {
            title: 'Creation Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let className = "px-3 py-2 rounded-lg text-xs font-normal ";
                if (status === 'Active') className += "bg-green-100 text-green-600";
                else className += "bg-gray-100 text-gray-600";
                return <span className={className}>{status}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: FeaturedListing) => {
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
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Featured Listings</h1>
                <CustomButton
                    onClick={() => setIsFilterModalOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <FilterOutlined />
                    Filters
                </CustomButton>
            </div>

            <GenericTable
                columns={columns}
                data={listings}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    current: filters.page,
                    pageSize: filters.limit,
                    total: listingResponse?.total || 0,
                    onChange: (page) => setFilters(prev => ({ ...prev, page })),
                }}
            />

            <FeaturedListingFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterSubmit}
                initialFilters={filters}
                userOptions={userOptions}
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Edit Listing"
            >
                {isLoadingSingle ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                        <CustomInput label="Pet Name" name="petName" control={control} placeholder="Pet Name" />
                        <CustomInput label="Type" name="type" control={control} placeholder="Type" />
                        <CustomInput label="Price" name="price" control={control} placeholder="Price" type="number" />

                        <CustomSelect
                            label="Status"
                            name="status"
                            control={control}
                            placeholder="Select Status"
                            options={[
                                { label: 'Active', value: 'Active' },
                                { label: 'Inactive', value: 'Inactive' },
                                { label: 'Pending', value: 'Pending' },
                            ]}
                        />

                        <CustomInput label="Description" name="description" control={control} placeholder="Description" />
                        {/* Note: User is not editable here as per typical requirements, but can be added if needed */}

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
                message="Are you sure you want to delete this listing?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};
