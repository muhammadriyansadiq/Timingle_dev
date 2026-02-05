import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomSelect } from '../../../shared/components/ui/CustomSelect';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import type { FeaturedListingFilters } from '../types';

interface FeaturedListingFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FeaturedListingFilters) => void;
    initialFilters: FeaturedListingFilters;
    userOptions: { label: string; value: number }[];
}

export const FeaturedListingFilterModal: React.FC<FeaturedListingFilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
    initialFilters,
    userOptions,
}) => {
    const { control, handleSubmit, reset } = useForm<FeaturedListingFilters>({
        defaultValues: initialFilters,
    });

    useEffect(() => {
        if (isOpen) {
            reset(initialFilters);
        }
    }, [isOpen, initialFilters, reset]);

    const handleResetFilters = () => {
        const defaultFilters: FeaturedListingFilters = { page: 1, limit: 10, lang: 'ur' };
        reset(defaultFilters);
        onApply(defaultFilters);
    };

    const onSubmit = (data: FeaturedListingFilters) => {
        onApply(data);
    };

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Listings"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CustomSelect
                    label="User"
                    name="userId"
                    control={control}
                    placeholder="Select User"
                    options={userOptions}
                />
                <CustomInput label="Type" name="type" control={control} placeholder="e.g. Bird" />
                <CustomInput label="Pet Name" name="petName" control={control} placeholder="e.g. Parrot" />

                <CustomSelect
                    label="Owner Role"
                    name="role"
                    control={control}
                    placeholder="Select Role"
                    options={[
                        { label: 'User', value: 'User' },
                        { label: 'Vendor', value: 'Vendor' },
                        { label: 'Breader', value: 'Breader' },
                        { label: 'Admin', value: 'Admin' },
                        { label: 'Veterniary', value: 'Veterniary' },
                    ]}
                />

                <div className="flex gap-4">
                    <CustomInput label="Min Price" name="minPrice" control={control} placeholder="0" type="number" />
                    <CustomInput label="Max Price" name="maxPrice" control={control} placeholder="1000" type="number" />
                </div>

                <CustomInput label="Language" name="lang" control={control} placeholder="ur" />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <CustomButton
                        htmlType="submit"
                        variant="primary"
                        className="h-10! px-4! rounded-lg"
                    >
                        Apply Filters
                    </CustomButton>
                </div>
            </form>
        </GenericModal>
    );
};
