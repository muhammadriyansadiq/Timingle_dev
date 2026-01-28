import { apiClient } from '../../../shared/api/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface User {
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

export interface UserResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: User[];
}

export interface SingleUserResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: User;
}

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    status?: string;
    // Add other fields as necessary based on the form
}

// Fetch all users
export const getUsers = async (search?: string): Promise<UserResponse> => {
    const params = search ? { search } : {};
    const response = await apiClient.get<UserResponse>('/user', { params });
    return response.data;
};

export const useUsers = (search?: string) => {
    return useQuery({
        queryKey: ['users', search],
        queryFn: () => getUsers(search),
    });
};

// Fetch single user by ID
export const getUser = async (id: number): Promise<SingleUserResponse> => {
    // Assuming REST standard /user/:id. 
    // If the user specifically meant /edit/:id API endpoint, this path should be changed to `/edit/${id}`
    const response = await apiClient.get<SingleUserResponse>(`/user/${id}`);
    return response.data;
};

export const useUser = (id: number | null) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id!),
        enabled: !!id, // Only fetch when id is present
    });
};

// Update User
export const updateUser = async ({ id, data }: { id: number; data: UpdateUserPayload }): Promise<SingleUserResponse> => {
    const response = await apiClient.put<SingleUserResponse>(`/user/${id}`, data);
    return response.data;
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// Delete User
export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
