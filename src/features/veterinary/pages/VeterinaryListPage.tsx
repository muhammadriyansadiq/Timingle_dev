import React, { useState } from 'react';
import { Dropdown, DatePicker } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Veterinary } from '../types';
import dayjs from 'dayjs';

// Mock Data
const mockVeterinaries: Veterinary[] = [
    { id: '00001', name: 'Christine Brooks', email: 'user1@gmail.com', date: '14 Feb 2025', type: 'Vendor', status: 'Active' },
    { id: '00002', name: 'Rosie Pearson', email: 'user2@gmail.com', date: '14 Feb 2025', type: 'Vendor', status: 'Offline' },
    { id: '00003', name: 'Darrell Caldwell', email: 'user3@gmail.com', date: '14 Feb 2025', type: 'Vendor', status: 'Suspended' },
    { id: '00004', name: 'Gilbert Johnston', email: 'user4@gmail.com', date: '14 Feb 2025', type: 'Vendor', status: 'Active' },
    { id: '00005', name: 'Alan Cain', email: 'user5@gmail.com', date: '14 Feb 2025', type: 'Vendor', status: 'Offline' },
    { id: '00006', name: 'Alfred Murray', email: 'user6@gmail.com', date: '14 Feb 2025', type: 'Vendor', status: 'Active' },
];

const veterinarySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    date: z.string().min(1, 'Date is required'),
    type: z.string().min(1, 'Type is required'),
    status: z.enum(['Active', 'Offline', 'Suspended']),
});

type VeterinarySchema = z.infer<typeof veterinarySchema>;

export const VeterinaryListPage: React.FC = () => {
    const [veterinaries, setVeterinaries] = useState<Veterinary[]>(mockVeterinaries);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVet, setSelectedVet] = useState<Veterinary | null>(null);

    const { control, handleSubmit, reset, setValue } = useForm<VeterinarySchema>({
        resolver: zodResolver(veterinarySchema),
        defaultValues: {
            name: '',
            email: '',
            date: dayjs().format('DD MMM YYYY'),
            type: 'Vendor',
            status: 'Active',
        }
    });

    const handleCreateClick = () => {
        setSelectedVet(null);
        reset({
            name: '',
            email: '',
            date: dayjs().format('DD MMM YYYY'),
            type: 'Vendor',
            status: 'Active',
        });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (vet: Veterinary) => {
        setSelectedVet(vet);
        setValue('name', vet.name);
        setValue('email', vet.email || '');
        setValue('date', vet.date || '');
        setValue('type', vet.type || 'Vendor');
        setValue('status', vet.status || 'Active');
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (vet: Veterinary) => {
        setSelectedVet(vet);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedVet) {
            setVeterinaries(veterinaries.filter(v => v.id !== selectedVet.id));
            setIsDeleteModalOpen(false);
            setSelectedVet(null);
        }
    };

    const onSubmitEdit = (data: VeterinarySchema) => {
        if (selectedVet) {
            setVeterinaries(veterinaries.map(v => (v.id === selectedVet.id ? { ...v, ...data } : v)));
        } else {
            const newVet: Veterinary = {
                id: Math.random().toString(36).substr(2, 5).padStart(5, '0'),
                ...data,
            };
            setVeterinaries([...veterinaries, newVet]);
        }
        setIsEditModalOpen(false);
        setSelectedVet(null);
        reset();
    };

    // Disable dates logic
    const disabledDate = (current: dayjs.Dayjs) => {
        const minDate = selectedVet && selectedVet.date
            ? dayjs(selectedVet.date)
            : dayjs();
        return current && current < minDate.startOf('day');
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
            render: (_: any, record: Veterinary) => {
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
            <div className="flex items-center mb-6 justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Veterinary List</h1>
                    <SearchBar className="w-80 border-none" onSearch={(val: string) => console.log(val)} />
                </div>
                {/* Optional: Add Create button if needed for this view, though design doesn't explicitly show it, usually implied for CRUD */}
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 bg-[#A26CF7] text-white px-4 py-2 rounded-lg hover:bg-[#8f5de8] transition-colors font-medium shadow-sm"
                >
                    <PlusOutlined /> Create New
                </button>
            </div>

            <GenericTable
                columns={columns}
                data={veterinaries}
                loading={false}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={selectedVet ? "Edit Veterinary" : "Create Veterinary"}
            >
                <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                    <CustomInput label="Name" name="name" control={control} placeholder="Name" />
                    <CustomInput label="Email" name="email" control={control} placeholder="Email" />

                    <div className="flex flex-col mb-4">
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
                        label="Type"
                        name="type"
                        control={control}
                        placeholder="Select Type"
                        options={[
                            { label: 'Vendor', value: 'Vendor' },
                            { label: 'Breeder', value: 'Breeder' },
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
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#A26CF7] text-white hover:bg-[#8f5de8] transition-colors shadow-md"
                        >
                            {selectedVet ? 'Update' : 'Create'}
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
                message="Are you sure you want to delete this record?"
                confirmText="Confirm"
            />
        </>
    );
};
