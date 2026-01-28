import { apiClient } from '../../../shared/api/axios-client';
import { useMutation } from '@tanstack/react-query';

export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
            // add other user fields if known
        };
    };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
};

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // Save token
            console.log(data, "checking");
            localStorage.setItem('token', data.data.token);
            // You might want to update global user state here if you have a context/store
        },
    });
};
