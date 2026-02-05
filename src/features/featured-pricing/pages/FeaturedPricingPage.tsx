import React, { useState, useEffect } from 'react';
import { Dropdown, message, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';

import {
    useFeaturedPricings,
    useCreateFeaturedPricing,
    useUpdateFeaturedPricing,
    useDeleteFeaturedPricing,
    useFeaturedPricing
} from '../api/featuredPricing';
import type { FeaturedPricing, CreateFeaturedPricingPayload, UpdateFeaturedPricingPayload } from '../types';

export const FeaturedPricingPage: React.FC = () => {
    // State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Fetch Data
    const { data: pricingResponse, isLoading } = useFeaturedPricings({ page, limit });
    const pricings = pricingResponse?.data || [];
    const total = pricingResponse?.total || 0;

    // Fetch Single Pricing (for Edit)
    const { data: singlePricingResponse, isLoading: isLoadingSingle } = useFeaturedPricing(selectedId);
    const singlePricing = singlePricingResponse?.data;

    // Mutations
    const { mutate: createPricing, isPending: isCreating } = useCreateFeaturedPricing();
    const { mutate: updatePricing, isPending: isUpdating } = useUpdateFeaturedPricing();
    const { mutate: deletePricing } = useDeleteFeaturedPricing();

    // Forms
    const {
        control: createControl,
        handleSubmit: handleCreateSubmit,
        reset: resetCreate
    } = useForm<CreateFeaturedPricingPayload>();

    const {
        control: editControl,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        formState: { isDirty: isEditDirty }
    } = useForm<UpdateFeaturedPricingPayload>();

    // Populate Edit Form
    useEffect(() => {
        if (singlePricing && isEditModalOpen) {
            resetEdit({
                periodTime: singlePricing.periodTime,
                monthlyPayment: Number(singlePricing.monthlyPayment),
                discount: Number(singlePricing.discount),
                totalPayment: Number(singlePricing.totalPayment),
                status: singlePricing.status,
            });
        }
    }, [singlePricing, isEditModalOpen, resetEdit]);

    // Handlers
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        resetCreate();
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedId(null);
        resetEdit();
    };

    const handleEditClick = (id: number) => {
        setSelectedId(id);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    // Submissions
    const onCreate = (data: CreateFeaturedPricingPayload) => {
        // Ensure numbers are sent as numbers
        const payload = {
            ...data,
            monthlyPayment: Number(data.monthlyPayment),
            discount: Number(data.discount),
            totalPayment: Number(data.totalPayment)
        };

        createPricing(payload, {
            onSuccess: () => {
                message.success('Pricing plan created successfully');
                handleCloseCreateModal();
            },
            onError: () => {
                message.error('Failed to create pricing plan');
            }
        });
    };

    const onUpdate = (data: UpdateFeaturedPricingPayload) => {
        if (selectedId) {
            const payload = {
                ...data,
                monthlyPayment: data.monthlyPayment ? Number(data.monthlyPayment) : undefined,
                discount: data.discount ? Number(data.discount) : undefined,
                totalPayment: data.totalPayment ? Number(data.totalPayment) : undefined
            };

            updatePricing({ id: selectedId, data: payload }, {
                onSuccess: () => {
                    message.success('Pricing plan updated successfully');
                    handleCloseEditModal();
                },
                onError: () => {
                    message.error('Failed to update pricing plan');
                }
            });
        }
    };

    const confirmDelete = () => {
        if (selectedId) {
            deletePricing(selectedId, {
                onSuccess: () => {
                    message.success('Pricing plan deleted successfully');
                    setIsDeleteModalOpen(false);
                    setSelectedId(null);
                },
                onError: () => {
                    message.error('Failed to delete pricing plan');
                }
            });
        }
    };

    // Columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Period',
            dataIndex: 'periodTime',
            key: 'periodTime',
        },
        {
            title: 'Monthly Payment',
            dataIndex: 'monthlyPayment',
            key: 'monthlyPayment',
            render: (val: string) => `$${val}`,
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (val: string) => `$${val}`,
        },
        {
            title: 'Total Payment',
            dataIndex: 'totalPayment',
            key: 'totalPayment',
            render: (val: string) => `$${val}`,
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
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: FeaturedPricing) => {
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
                <h1 className="text-2xl font-bold text-gray-800">Featured Pricing Plans</h1>
                <CustomButton
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="primary"
                    className="h-11! px-6! rounded-lg"
                >
                    <PlusOutlined />
                    Create Plan
                </CustomButton>
            </div>

            <GenericTable
                columns={columns}
                data={pricings}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: total,
                    onChange: (p) => setPage(p),
                }}
            />

            {/* Create Modal */}
            <GenericModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                title="Create Pricing Plan"
            >
                <form onSubmit={handleCreateSubmit(onCreate)} className="space-y-4">
                    <CustomInput label="Period Time" name="periodTime" control={createControl} placeholder="e.g 90 days" />
                    <CustomInput label="Monthly Payment" name="monthlyPayment" control={createControl} placeholder="0" type="number" />
                    <CustomInput label="Discount" name="discount" control={createControl} placeholder="0" type="number" />
                    <CustomInput label="Total Payment" name="totalPayment" control={createControl} placeholder="0" type="number" />

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
                            Create
                        </CustomButton>
                    </div>
                </form>
            </GenericModal>

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Edit Pricing Plan"
            >
                {isLoadingSingle ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <form onSubmit={handleEditSubmit(onUpdate)} className="space-y-4">
                        <CustomInput label="Period Time" name="periodTime" control={editControl} placeholder="e.g 90 days" />
                        <CustomInput label="Monthly Payment" name="monthlyPayment" control={editControl} placeholder="0" type="number" />
                        <CustomInput label="Discount" name="discount" control={editControl} placeholder="0" type="number" />
                        <CustomInput label="Total Payment" name="totalPayment" control={editControl} placeholder="0" type="number" />

                        <CustomSelect
                            label="Status"
                            name="status"
                            control={editControl}
                            placeholder="Select Status"
                            options={[
                                { label: 'Active', value: 'Active' },
                                { label: 'Inactive', value: 'Inactive' },
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
                                disabled={!isEditDirty || isUpdating}
                                variant="primary"
                                className="h-10! px-4! rounded-lg"
                            >
                                Save Changes
                            </CustomButton>
                        </div>
                    </form>
                )}
            </GenericModal>

            {/* Delete Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this pricing plan?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};
