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
            if (data?.data?.token) {
                localStorage.setItem('token', data.data.token);
            }
        },
    });
};

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
}

export const resetPassword = async (data: ResetPasswordRequest) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};
