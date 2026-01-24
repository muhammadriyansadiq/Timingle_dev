import React, { useState } from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomImageUpload } from '../../../shared/components/ui/CustomImageUpload';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { PromotionBannerCard } from '../components/PromotionBannerCard';
import type { PromotionBanner } from "../types"
import { SearchBar } from '../../../shared/components/ui/SearchBar';
// Mock Data
const initialBanners: PromotionBanner[] = [
    {
        id: '1',
        title: 'Spring Sale - 30% OFF Pet Supplies!',
        link: 'https://www.vecteezy.com/free-photos',
        description: 'Get the best deals on pet food, toys, and accessories this spring season.',
        imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Dog image
        isActive: true,
    },
    {
        id: '2',
        title: 'New Arrival: Organic Dog Food',
        link: 'https://www.vecteezy.com/free-photos',
        description: 'Healthy and nutritious organic food for your furry friends. Now available in store!',
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Puppy image
        isActive: false,
    },
];

// Schema
const bannerSchema = z.object({
    title: z.string().min(1, 'Banner Title is required'),
    link: z.string().url('Must be a valid URL'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().min(1, 'Image is required'),
});

type BannerSchema = z.infer<typeof bannerSchema>;

export const PromotionBannerPage: React.FC = () => {
    const [banners, setBanners] = useState<PromotionBanner[]>(initialBanners);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<PromotionBanner | null>(null);

    const { control, handleSubmit, reset, setValue } = useForm<BannerSchema>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            title: '',
            link: '',
            description: '',
            imageUrl: '',
        }
    });

    const handleCreateClick = () => {
        setIsCreateMode(true);
        setSelectedBanner(null);
        reset({ title: '', link: '', description: '', imageUrl: '' });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (banner: PromotionBanner) => {
        setIsCreateMode(false);
        setSelectedBanner(banner);
        setValue('title', banner.title);
        setValue('link', banner.link);
        setValue('description', banner.description);
        setValue('imageUrl', banner.imageUrl);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (banner: PromotionBanner) => {
        setSelectedBanner(banner);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedBanner) {
            setBanners(banners.filter(b => b.id !== selectedBanner.id));
            setIsDeleteModalOpen(false);
            setSelectedBanner(null);
        }
    };

    const handleToggleActive = (banner: PromotionBanner) => {
        setBanners(banners.map(b =>
            b.id === banner.id ? { ...b, isActive: !b.isActive } : b
        ));
    };

    const onSubmit = (data: BannerSchema) => {
        if (isCreateMode) {
            const newBanner: PromotionBanner = {
                id: Math.random().toString(36).substr(2, 5),
                ...data,
                isActive: true,
            };
            setBanners([...banners, newBanner]);
        } else if (selectedBanner) {
            setBanners(banners.map(b =>
                b.id === selectedBanner.id ? { ...b, ...data } : b
            ));
        }
        setIsEditModalOpen(false);
        reset();
    };

    return (
        <>
            {/* Header / Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Promotion Banner</h1>

                    <div className="ml-5 relative w-full md:w-64">
                        {/* <Input
                            prefix={<SearchOutlined className="text-gray-400" />}
                            placeholder="Search banner..."
                            className="w-full h-11 rounded-lg bg-gray-50 border-gray-200 hover:bg-white focus:bg-white"
                        /> */}
                        <SearchBar className="w-64 border-none" placeholder="Search Promotion..." />

                    </div>
                    <Select
                        placeholder="All Status"
                        className="w-32 h-12 custom-select-filter"
                        suffixIcon={null}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]}
                    />
                    <DatePicker
                        placeholder="All Dates"
                        className="w-32 h-12 rounded-lg"
                        format="DD/MM/YYYY"
                    />
                </div>

                <Button
                    icon={<PlusOutlined />}
                    className="!bg-yellow-500 !text-black !border-none hover:!bg-primary  !h-11 px-6 font-semibold rounded-lg shadow-sm"
                    onClick={handleCreateClick}
                >
                    Add Featured
                </Button>
            </div>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banners.map(banner => (
                    <PromotionBannerCard
                        key={banner.id}
                        banner={banner}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onToggleActive={handleToggleActive}
                    />
                ))}
            </div>

            {/* Create/Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={isCreateMode ? "PROMOTION BANNER" : "EDIT PROMOTION BANNER"}
                width={600}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    {/* Image Upload Centered */}
                    <div className="flex justify-center">
                        <CustomImageUpload
                            name="imageUrl"
                            control={control}
                        />
                    </div>

                    <CustomInput
                        label="Banner Title"
                        name="title"
                        control={control}
                        placeholder="Title"
                    />

                    <CustomInput
                        label="Add Link"
                        name="link"
                        control={control}
                        placeholder="www.website.com"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...control.register('description')}
                            className="w-full px-4 py-3 rounded-lg bg-[#FAF5F4] border-none focus:ring-2 focus:ring-purple-200 resize-none h-32"
                            placeholder="Enter Description"
                        />
                        {control.getFieldState('description').error && <span className="text-red-500 text-xs mt-1">{control.getFieldState('description').error?.message}</span>}
                    </div>

                    <Button
                        htmlType="submit"
                        className="w-full h-12 !bg-[#9F7AEA] !text-white !border-none hover:!bg-[#8bb4ee] rounded-xl text-lg font-semibold mt-4 shadow-md"
                    >
                        Update
                    </Button>
                </form>
            </GenericModal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Remove Banner"
                message="Are you sure you want to remove this promotion banner?"
                confirmText="Remove"
            />
        </>
    );
};
