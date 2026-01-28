import { apiClient } from '../../../shared/api/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Veterinary {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface VeterinaryResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Veterinary[];
}

export interface SingleVeterinaryResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Veterinary;
}

export interface CreateVeterinaryPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateVeterinaryPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    status?: string;
}

// Fetch all veterinaries with role=Veterinary filter
export const getVeterinaries = async (search?: string): Promise<VeterinaryResponse> => {
    const params: any = { role: 'Veterinary' };
    if (search) {
        params.search = search;
    }
    const response = await apiClient.get<VeterinaryResponse>('/user', { params });
    return response.data;
};

export const useVeterinaries = (search?: string) => {
    return useQuery({
        queryKey: ['veterinaries', search],
        queryFn: () => getVeterinaries(search),
    });
};

// Create Veterinary
export const createVeterinary = async (data: CreateVeterinaryPayload): Promise<SingleVeterinaryResponse> => {
    const response = await apiClient.post<SingleVeterinaryResponse>('/user', data);
    return response.data;
};

export const useCreateVeterinary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createVeterinary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['veterinaries'] });
        },
    });
};

// Fetch single veterinary by ID
export const getVeterinary = async (id: number): Promise<SingleVeterinaryResponse> => {
    const response = await apiClient.get<SingleVeterinaryResponse>(`/user/${id}`);
    return response.data;
};

export const useVeterinary = (id: number | null) => {
    return useQuery({
        queryKey: ['veterinary', id],
        queryFn: () => getVeterinary(id!),
        enabled: !!id,
    });
};

// Update Veterinary
export const updateVeterinary = async ({ id, data }: { id: number; data: UpdateVeterinaryPayload }): Promise<SingleVeterinaryResponse> => {
    const response = await apiClient.put<SingleVeterinaryResponse>(`/user/${id}`, data);
    return response.data;
};

export const useUpdateVeterinary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVeterinary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['veterinaries'] });
        },
    });
};

// Delete Veterinary
export const deleteVeterinary = async (id: number): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
};

export const useDeleteVeterinary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVeterinary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['veterinaries'] });
        },
    });
};
