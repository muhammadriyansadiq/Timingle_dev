import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../../dashboard/components/DashboardLayout';
import { ConfirmationModal } from '../../../shared/components/ui/ConfirmationModal';
import { GenericModal } from '../../../shared/components/ui/GenericModal';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomImageUpload } from '../../../shared/components/ui/CustomImageUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Veterinary } from '../types';

// Mock Data
const mockTopVets: Veterinary[] = [
    { id: '1', name: 'DANIELLE JONES', image: 'https://i.pravatar.cc/150?u=1', type: 'DVM' }, // Using mock images
    { id: '2', name: 'NITA LANDRY', image: 'https://i.pravatar.cc/150?u=2', type: 'DVM' },
    { id: '3', name: 'MICHAELL BRODMAN', image: 'https://i.pravatar.cc/150?u=3', type: 'MD' },
    { id: '4', name: 'MARK B. WOODLAND', image: 'https://i.pravatar.cc/150?u=4', type: 'DVM' },
    { id: '5', name: 'DANIELLE JONES', image: 'https://i.pravatar.cc/150?u=5', type: 'DVM' },
    { id: '6', name: 'NITA LANDRY', image: 'https://i.pravatar.cc/150?u=6', type: 'DVM' },
    { id: '7', name: 'MICHAELL BRODMAN', image: 'https://i.pravatar.cc/150?u=7', type: 'MD' },
    { id: '8', name: 'MARK B. WOODLAND', image: 'https://i.pravatar.cc/150?u=8', type: 'DVM' },
];

const topVetSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    image: z.string().optional(),
});

type TopVetSchema = z.infer<typeof topVetSchema>;

export const TopVeterinaryPage: React.FC = () => {
    const [vets, setVets] = useState<Veterinary[]>(mockTopVets);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVet, setSelectedVet] = useState<Veterinary | null>(null);

    const { control, handleSubmit, reset, setValue } = useForm<TopVetSchema>({
        resolver: zodResolver(topVetSchema),
        defaultValues: {
            name: '',
            image: '',
        }
    });

    const handleCreateClick = () => {
        setSelectedVet(null);
        reset({
            name: '',
            image: '',
        });
        setIsEditModalOpen(true);
    };

    const handleEditClick = (vet: Veterinary) => {
        setSelectedVet(vet);
        setValue('name', vet.name);
        setValue('image', vet.image || '');
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (vet: Veterinary) => {
        setSelectedVet(vet);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedVet) {
            setVets(vets.filter(v => v.id !== selectedVet.id));
            setIsDeleteModalOpen(false);
            setSelectedVet(null);
        }
    };

    const onSubmitEdit = (data: TopVetSchema) => {
        if (selectedVet) {
            setVets(vets.map(v => (v.id === selectedVet.id ? { ...v, ...data } : v)));
        } else {
            const newVet: Veterinary = {
                id: Math.random().toString(36).substr(2, 5),
                ...data,
            };
            setVets([...vets, newVet]);
        }
        setIsEditModalOpen(false);
        setSelectedVet(null);
        reset();
    };

    return (
        <>
            <div className="flex md:items-center mb-8 justify-between flex-col md:flex-row">
                <h1 className="text-2xl font-bold text-gray-800">Top Veterinary</h1>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 bg-[#A26CF7] text-white px-4 py-2 rounded-lg hover:bg-[#8f5de8] transition-colors font-medium shadow-sm w-fit mt-4 md:mt-0"
                >
                    <PlusOutlined /> Add Top Vet
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vets.map((vet) => (
                    <div key={vet.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-w-3 aspect-h-2 mb-4 rounded-lg overflow-hidden bg-gray-100 h-48">
                            {vet.image ? (
                                <img src={vet.image} alt={vet.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-4 uppercase">{vet.name}</h3>
                        <div className="flex gap-4 border-t border-gray-100 pt-3">
                            <button
                                onClick={() => handleEditClick(vet)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                            >
                                <EditOutlined /> Edit
                            </button>
                            <button
                                onClick={() => handleDeleteClick(vet)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 ml-auto"
                            >
                                <DeleteOutlined /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <GenericModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={selectedVet ? "Edit Top Vet" : "Add Top Vet"}
            >
                <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
                    <div className="flex justify-center">
                        <CustomImageUpload
                            name="image"
                            control={control}
                        // label="Upload Photo"
                        />
                    </div>
                    <CustomInput label="Name" name="name" control={control} placeholder="Dr. Name" />

                    <div className="flex justify-end gap-3 mt-8">
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
                message="Are you sure you want to delete this top vet?"
                confirmText="Confirm"
            />
        </>
    );
};
