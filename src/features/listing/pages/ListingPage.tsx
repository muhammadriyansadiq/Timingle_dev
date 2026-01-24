import React, { useState } from 'react';
import { Dropdown, Select, Button, DatePicker } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, StarFilled, StarOutlined, PlusOutlined } from '@ant-design/icons';
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

const mockListings = [
    { id: '001', name: 'Happy Paws', type: 'Veterinary', owner: 'John', status: 'Active', isFeatured: true },
    { id: '002', name: 'Puppy World', type: 'Breeder', owner: 'Amy', status: 'Expired', isFeatured: false },
    { id: '003', name: 'Friendly Tails', type: 'Vendor', owner: 'Mike', status: 'Paused', isFeatured: false },
];

const listingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    owner: z.string().min(1, 'Owner is required'),
    status: z.string().min(1, 'Status is required'),
});

type ListingSchema = z.infer<typeof listingSchema>;



export const ListingPage: React.FC = () => {
    const [listings, setListings] = useState(mockListings);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedListing, setSelectedListing] = useState<any>(null);

    const { control, handleSubmit, reset, setValue } = useForm<ListingSchema>({
        resolver: zodResolver(listingSchema),
    });

    const handleCreateClick = () => {
        setIsCreateMode(true);
        setSelectedListing(null);
        reset({ name: '', type: '', owner: '', status: '' });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (listing: any) => {
        setIsCreateMode(false);
        setSelectedListing(listing);
        setValue('name', listing.name);
        setValue('type', listing.type);
        setValue('owner', listing.owner);
        setValue('status', listing.status);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (listing: any) => {
        setSelectedListing(listing);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setListings(listings.filter(l => l.id !== selectedListing.id));
        setIsDeleteModalOpen(false);
        setSelectedListing(null);
    };

    const onSubmit = (data: ListingSchema) => {
        if (isCreateMode) {
            const newListing = {
                id: Math.random().toString(36).substr(2, 5),
                ...data,
                isFeatured: false,
            };
            setListings([...listings, newListing]);
        } else {
            setListings(listings.map(l => (l.id === selectedListing.id ? { ...l, ...data } : l)));
        }
        setIsEditModalOpen(false);
        reset();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Listing Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let className = "px-3 py-2 rounded-lg text-xs font-normal ";
                if (status === 'Active') className += "bg-green-100 text-green-600";
                if (status === 'Models') className += "bg-purple-100 text-purple-600";
                if (status === 'Expired') className += "bg-red-100 text-red-600";
                if (status === 'Paused') className += "bg-yellow-100 text-yellow-600";

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
            {/* Header with Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <SearchBar className="w-64 border-none" placeholder="Search listing..." />
                    <Select placeholder="All Types" className="w-32 h-12" size="large" />
                    <Select placeholder="All Status" className="w-32 h-12" size="large" />
                    <DatePicker placeholder="All Dates" className="w-32 h-12" size="large" format="DD/MM/YYYY" />
                </div>

                <Button
                    icon={<PlusOutlined />}
                    className="!bg-yellow-500 !text-text !border-none hover:!bg-primary !h-11 px-6 font-semibold"
                    onClick={handleCreateClick}
                >
                    Add Featured
                </Button>
            </div>

            <GenericTable
                columns={columns}
                data={listings}
                loading={false}
                rowKey="id"
            />
            {/* <div className='flex justify-between items-center '>
                <div className='border-2 shrink-1'>1</div>
                <div className='border-2 shrink-2'>2</div>
                <div className='border-2 shrink-2 '>3</div>
                <div className='border-2 shrink-1'>4</div>
            </div> */}
            {/* Create/Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreateMode ? "Add Listing" : "Edit Listing"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <CustomInput label="Listing Name" name="name" control={control} placeholder="Listing Name" />
                    <CustomSelect
                        label="Type"
                        name="type"
                        control={control}
                        placeholder="Select Type"
                        options={[
                            { label: 'Veterinary', value: 'Veterinary' },
                            { label: 'Breeder', value: 'Breeder' },
                            { label: 'Vendor', value: 'Vendor' },
                        ]}
                    />
                    <CustomSelect
                        label="Owner"
                        name="owner"
                        control={control}
                        placeholder="Select Owner"
                        options={[
                            { label: 'John', value: 'John' },
                            { label: 'Amy', value: 'Amy' },
                            { label: 'Mike', value: 'Mike' },
                        ]}
                    />
                    <CustomSelect
                        label="Status"
                        name="status"
                        control={control}
                        placeholder="Select Status"
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Expired', value: 'Expired' },
                            { label: 'Paused', value: 'Paused' },
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
                            {isCreateMode ? 'Create' : 'Save Changes'}
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
                message="Are you sure you want to delete this listing?"
                confirmText="Delete"
            />
        </>
    );
};
