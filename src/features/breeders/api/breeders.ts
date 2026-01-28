import { apiClient } from '../../../shared/api/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Breeder {
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

export interface BreederResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Breeder[];
}

export interface SingleBreederResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Breeder;
}

export interface CreateBreederPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateBreederPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    status?: string;
}

// Fetch all breeders with role=Breeder filter
export const getBreeders = async (search?: string): Promise<BreederResponse> => {
    const params: any = { role: 'Breeder' };
    if (search) {
        params.search = search;
    }
    const response = await apiClient.get<BreederResponse>('/user', { params });
    return response.data;
};

export const useBreeders = (search?: string) => {
    return useQuery({
        queryKey: ['breeders', search],
        queryFn: () => getBreeders(search),
    });
};

// Create Breeder
export const createBreeder = async (data: CreateBreederPayload): Promise<SingleBreederResponse> => {
    const response = await apiClient.post<SingleBreederResponse>('/user', data);
    return response.data;
};

export const useCreateBreeder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBreeder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['breeders'] });
        },
    });
};

// Fetch single breeder by ID
export const getBreeder = async (id: number): Promise<SingleBreederResponse> => {
    const response = await apiClient.get<SingleBreederResponse>(`/user/${id}`);
    return response.data;
};

export const useBreeder = (id: number | null) => {
    return useQuery({
        queryKey: ['breeder', id],
        queryFn: () => getBreeder(id!),
        enabled: !!id,
    });
};

// Update Breeder
export const updateBreeder = async ({ id, data }: { id: number; data: UpdateBreederPayload }): Promise<SingleBreederResponse> => {
    const response = await apiClient.put<SingleBreederResponse>(`/user/${id}`, data);
    return response.data;
};

export const useUpdateBreeder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBreeder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['breeders'] });
        },
    });
};

// Delete Breeder
export const deleteBreeder = async (id: number): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
};

export const useDeleteBreeder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBreeder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['breeders'] });
        },
    });
};
