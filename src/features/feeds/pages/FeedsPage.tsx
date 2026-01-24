import React, { useState } from 'react';
import { Dropdown, Avatar, Button, DatePicker } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
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
import type { Feed } from '../types';
import dayjs from 'dayjs';

// Mock Data
const mockFeeds: Feed[] = [
    { id: '00001', name: 'Morning Update', email: 'feed1@gmail.com', date: '14 Feb 2025', type: 'Feeds', status: 'Active' },
    { id: '00002', name: 'Weekly Digest', email: 'feed2@gmail.com', date: '14 Feb 2025', type: 'Feeds', status: 'Offline' },
    { id: '00003', name: 'Special Announcement', email: 'feed3@gmail.com', date: '14 Feb 2025', type: 'Feeds', status: 'Suspended' },
];

const feedSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    type: z.string().min(1, 'Type is required'),
    date: z.string().min(1, 'Date is required'),
    status: z.enum(['Active', 'Offline', 'Suspended']),
});

type FeedSchema = z.infer<typeof feedSchema>;

export const FeedsPage: React.FC = () => {
    const [feeds, setFeeds] = useState<Feed[]>(mockFeeds);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);

    const { control, handleSubmit, reset, setValue } = useForm<FeedSchema>({
        resolver: zodResolver(feedSchema),
        defaultValues: {
            name: '',
            email: '',
            type: 'Feeds',
            date: dayjs().format('DD MMM YYYY'),
            status: 'Active',
        }
    });

    const handleCreateClick = () => {
        setSelectedFeed(null);
        reset({
            name: '',
            email: '',
            type: 'Feeds',
            date: dayjs().format('DD MMM YYYY'),
            status: 'Active',
        });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (feed: Feed) => {
        setSelectedFeed(feed);
        setValue('name', feed.name);
        setValue('email', feed.email);
        setValue('type', feed.type);
        setValue('date', feed.date);
        setValue('status', feed.status);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (feed: Feed) => {
        setSelectedFeed(feed);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedFeed) {
            setFeeds(feeds.filter(f => f.id !== selectedFeed.id));
            setIsDeleteModalOpen(false);
            setSelectedFeed(null);
        }
    };

    const onSubmitEdit = (data: FeedSchema) => {
        if (selectedFeed) {
            setFeeds(feeds.map(f => (f.id === selectedFeed.id ? { ...f, ...data } : f)));
        } else {
            const newFeed: Feed = {
                id: Math.random().toString(36).substr(2, 5),
                ...data,
            };
            setFeeds([...feeds, newFeed]);
        }
        setIsEditModalOpen(false);
        setSelectedFeed(null);
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
                    <Avatar icon={<UserOutlined />} src={`https://api.dicebear.com/7.x/identicon/svg?seed=${text}`} />
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
            render: (_: any, record: Feed) => {
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

    // Disable dates before today (keep today enabled)
    const disabledDate = (current: dayjs.Dayjs) => {
        // If editing, disable dates before the original date
        // If creating, disable dates before today
        const minDate = selectedFeed && selectedFeed.date
            ? dayjs(selectedFeed.date)
            : dayjs();

        return current && current < minDate.startOf('day');
    };

    return (
        <>
            <div className="flex items-center mb-6 justify-between">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Feeds</h1>
                    <SearchBar className="ml-5 w-96 border-none" onSearch={(val: string) => console.log(val)} />
                </div>
                <Button
                    icon={<PlusOutlined />}
                    className=" bg-buttonbgcolor! text-white! border-none! hover:bg-[#8f5de8]! h-11! px-6 font-semibold rounded-lg shadow-sm"
                    onClick={handleCreateClick}
                >
                    Create Feed
                </Button>
            </div>

            <GenericTable
                columns={columns}
                data={feeds}
                loading={false}
                rowKey="id"
            />

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={selectedFeed ? "Edit Feed" : "Create Feed"}
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
                            { label: 'Feeds', value: 'Feeds' },
                        ]}
                    />

                    <div>
                        <label className="mb-2 text-sm font-medium text-gray-700 block">Date</label>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <DatePicker
                                    className="w-full h-11"
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
                message="Are you sure you want to delete this feed?"
                confirmText="Confirm"
            />
        </>
    );
};
