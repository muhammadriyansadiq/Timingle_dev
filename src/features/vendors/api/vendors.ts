import { apiClient } from '../../../shared/api/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Vendor {
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

export interface VendorResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Vendor[];
}

export interface SingleVendorResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Vendor;
}

export interface CreateVendorPayload {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateVendorPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    status?: string;
}

// Fetch all vendors with role=Vendor filter
export const getVendors = async (search?: string): Promise<VendorResponse> => {
    const params: any = { role: 'Vendor' };
    if (search) {
        params.search = search;
    }
    const response = await apiClient.get<VendorResponse>('/user', { params });
    return response.data;
};

export const useVendors = (search?: string) => {
    return useQuery({
        queryKey: ['vendors', search],
        queryFn: () => getVendors(search),
    });
};

// Create Vendor
export const createVendor = async (data: CreateVendorPayload): Promise<SingleVendorResponse> => {
    const response = await apiClient.post<SingleVendorResponse>('/user', data);
    return response.data;
};

export const useCreateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createVendor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};

// Fetch single vendor by ID
export const getVendor = async (id: number): Promise<SingleVendorResponse> => {
    const response = await apiClient.get<SingleVendorResponse>(`/user/${id}`);
    return response.data;
};

export const useVendor = (id: number | null) => {
    return useQuery({
        queryKey: ['vendor', id],
        queryFn: () => getVendor(id!),
        enabled: !!id,
    });
};

// Update Vendor
export const updateVendor = async ({ id, data }: { id: number; data: UpdateVendorPayload }): Promise<SingleVendorResponse> => {
    const response = await apiClient.put<SingleVendorResponse>(`/user/${id}`, data);
    return response.data;
};

export const useUpdateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateVendor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};

// Delete Vendor
export const deleteVendor = async (id: number): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
};

export const useDeleteVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVendor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
        },
    });
};
