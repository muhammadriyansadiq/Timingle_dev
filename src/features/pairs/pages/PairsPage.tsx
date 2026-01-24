import React, { useState } from 'react';
import { Dropdown, Button, Avatar, DatePicker } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { GenericTable } from '../../../shared/components/ui/GenericTable';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { CustomImageUpload } from '../../../shared/components/ui/CustomImageUpload';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Pair } from '../types';
import dayjs from 'dayjs';

// Mock Data
const mockPairs: Pair[] = [
    { id: '00001', pairsName: 'Happy Paws', owner: 'Alex Mill', date: '14 Feb 2025', type: 'Breeder', status: 'Paid' },
    { id: '00002', pairsName: 'Puppy World', owner: 'William Nox', date: '14 Feb 2025', type: 'Vendor', status: 'Paid' },
    { id: '00003', pairsName: 'Dogs Life', owner: 'Darrell Caldwell', date: '14 Feb 2025', type: 'Vendor', status: 'Not Pay' },
    { id: '00004', pairsName: 'Bird Tails', owner: 'Barrell Heldwex', date: '14 Feb 2025', type: 'Vendor', status: 'Paid' },
    { id: '00005', pairsName: 'Rabbit Calf', owner: 'Alan Cain', date: '14 Feb 2025', type: 'Breeder', status: 'Not Pay' },
    { id: '00006', pairsName: 'Meows Life', owner: 'Alfred Murray', date: '14 Feb 2025', type: 'Breeder', status: 'Paid' },
];

const pairSchema = z.object({
    pairsName: z.string().min(1, 'Pairs Name is required'),
    owner: z.string().min(1, 'Owner is required'),
    date: z.string().min(1, 'Date is required'),
    type: z.enum(['Breeder', 'Vendor']),
    status: z.enum(['Paid', 'Not Pay']),
    image: z.string().optional(),
});

type PairSchema = z.infer<typeof pairSchema>;

export const PairsPage: React.FC = () => {
    const [pairs, setPairs] = useState<Pair[]>(mockPairs);
    const [filteredPairs, setFilteredPairs] = useState<Pair[]>(mockPairs);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
    const [filterType, setFilterType] = useState<string>('All');

    const { control, handleSubmit, reset, setValue } = useForm<PairSchema>({
        resolver: zodResolver(pairSchema),
        defaultValues: {
            pairsName: '',
            owner: '',
            date: dayjs().format('DD MMM YYYY'),
            type: 'Breeder',
            status: 'Paid',
            image: '',
        }
    });

    const handleCreateClick = () => {
        setSelectedPair(null);
        reset({
            pairsName: '',
            owner: '',
            date: dayjs().format('DD MMM YYYY'),
            type: 'Breeder',
            status: 'Paid',
            image: '',
        });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (pair: Pair) => {
        setSelectedPair(pair);
        setValue('pairsName', pair.pairsName);
        setValue('owner', pair.owner);
        setValue('date', pair.date);
        setValue('type', pair.type);
        setValue('status', pair.status);
        setValue('image', pair.image || ''); // Populate image if exists
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (pair: Pair) => {
        setSelectedPair(pair);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedPair) {
            const updatedPairs = pairs.filter(p => p.id !== selectedPair.id);
            setPairs(updatedPairs);
            applyFilter(filterType, updatedPairs);
            setIsDeleteModalOpen(false);
            setSelectedPair(null);
        }
    };

    const onSubmitEdit = (data: PairSchema) => {
        let updatedPairs;
        if (selectedPair) {
            updatedPairs = pairs.map(p => (p.id === selectedPair.id ? { ...p, ...data } : p));
        } else {
            const newPair: Pair = {
                id: Math.random().toString(36).substr(2, 5).padStart(5, '0'),
                ...data,
            };
            updatedPairs = [...pairs, newPair];
        }
        setPairs(updatedPairs);
        applyFilter(filterType, updatedPairs);
        setIsEditModalOpen(false);
        setSelectedPair(null);
        reset();
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setFilterType(type);
        applyFilter(type, pairs);
    };

    const applyFilter = (type: string, data: Pair[]) => {
        if (type === 'All') {
            setFilteredPairs(data);
        } else {
            setFilteredPairs(data.filter(p => p.type === type));
        }
    };

    // Disable dates logic
    const disabledDate = (current: dayjs.Dayjs) => {
        // If editing, disable dates before the original date
        // If creating, disable dates before today
        const minDate = selectedPair && selectedPair.date
            ? dayjs(selectedPair.date)
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
            title: 'PAIRS NAME',
            dataIndex: 'pairsName',
            key: 'pairsName',
            render: (_: string, record: Pair) => (
                <div className="flex items-center gap-3">
                    {record.image ? (
                        <Avatar src={record.image} className='!hidden md:block!' />
                    ) : (
                        <Avatar icon={<UserOutlined />} className='!hidden md:block!' />
                    )}
                    <span className="font-medium text-gray-800">{record.pairsName}</span>
                </div>
            ),
        },
        {
            title: 'OWNER',
            dataIndex: 'owner',
            key: 'owner',
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
                let className = "px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap inline-block text-center min-w-fit ";
                if (status === 'Paid') className += "bg-teal-100 text-teal-600";
                if (status === 'Not Pay') className += "bg-red-100 text-red-500";

                return <span className={className}>{status}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Pair) => {
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
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Pairs Manager</h1>
                    <SearchBar className="w-64 md:w-80 border-none" onSearch={(val: string) => console.log(val)} />
                    <select
                        value={filterType}
                        onChange={handleFilterChange}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none cursor-pointer hover:border-purple-400 transition-colors"
                    >
                        <option value="All">All Types</option>
                        <option value="Breeder">Breeder</option>
                        <option value="Vendor">Vendor</option>
                    </select> </div>

                <Button
                    icon={<PlusOutlined />}
                    className=" bg-buttonbgcolor! text-white! border-none! hover:bg-[#8f5de8]! h-11! px-6 font-semibold rounded-lg shadow-sm"
                    onClick={handleCreateClick}
                >
                    Add Record
                </Button>
            </div>

            {/* <div className="flex items-center flex-col md:flex-row gap-4 mb-6 justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-800">Pairs Manager</h1>
                    <SearchBar className="w-80 border-none" onSearch={(val: string) => console.log(val)} />
                    <select
                        value={filterType}
                        onChange={handleFilterChange}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none cursor-pointer hover:border-purple-400 transition-colors"
                    >
                        <option value="All">All Types</option>
                        <option value="Breeder">Breeder</option>
                        <option value="Vendor">Vendor</option>
                    </select>
                </div>
                <Button
                    icon={<PlusOutlined />}
                    className=" bg-buttonbgcolor! text-white! border-none! hover:bg-[#8f5de8]! h-11! px-6 font-semibold rounded-lg shadow-sm"
                    onClick={handleCreateClick}
                >
                    Add Record
                </Button>
            </div> */}

            <GenericTable
                columns={columns}
                data={filteredPairs}
                loading={false}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={selectedPair ? "Edit Pair" : "Add Pair"}
            >
                <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
                    {/* Image Upload Field */}
                    <div className="flex justify-center mb-6">
                        <CustomImageUpload
                            name="image"
                            control={control}
                        // label="Upload Image"
                        />
                    </div>

                    <CustomInput label="Pairs Name" name="pairsName" control={control} placeholder="Pairs Name" />
                    <CustomInput label="Owner" name="owner" control={control} placeholder="Owner Name" />

                    {/* For simplicity using text input for Date to match mock data mostly, or use DatePicker if preferred. 
                        Keeping it simple as text/auto-filled in background for now unless specific requirement. */}
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
                            { label: 'Breeder', value: 'Breeder' },
                            { label: 'Vendor', value: 'Vendor' },
                        ]}
                    />

                    <CustomSelect
                        label="Status"
                        name="status"
                        control={control}
                        placeholder="Select Status"
                        options={[
                            { label: 'Paid', value: 'Paid' },
                            { label: 'Not Pay', value: 'Not Pay' },
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
                            {selectedPair ? 'Update' : 'Create'}
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
