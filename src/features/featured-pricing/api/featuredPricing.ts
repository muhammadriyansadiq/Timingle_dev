import { apiClient } from '../../../shared/api/axios-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
    FeaturedPricingFilters,
    FeaturedPricingResponse,
    SingleFeaturedPricingResponse,
    CreateFeaturedPricingPayload,
    UpdateFeaturedPricingPayload
} from '../types';

// Fetch all pricings
export const getFeaturedPricings = async (filters: FeaturedPricingFilters): Promise<FeaturedPricingResponse> => {
    const params = { ...filters };
    const response = await apiClient.get<FeaturedPricingResponse>('/featured-listing/pricing', { params });
    return response.data;
};

export const useFeaturedPricings = (filters: FeaturedPricingFilters) => {
    return useQuery({
        queryKey: ['featured-pricings', filters],
        queryFn: () => getFeaturedPricings(filters),
    });
};

// Fetch single pricing
export const getFeaturedPricing = async (id: number): Promise<SingleFeaturedPricingResponse> => {
    const response = await apiClient.get<SingleFeaturedPricingResponse>(`/featured-listing/pricing/${id}`);
    return response.data;
};

export const useFeaturedPricing = (id: number | null) => {
    return useQuery({
        queryKey: ['featured-pricing', id],
        queryFn: () => getFeaturedPricing(id!),
        enabled: !!id,
    });
};

// Create Pricing
export const createFeaturedPricing = async (data: CreateFeaturedPricingPayload): Promise<SingleFeaturedPricingResponse> => {
    const response = await apiClient.post<SingleFeaturedPricingResponse>('/featured-listing/pricing', data);
    return response.data;
};

export const useCreateFeaturedPricing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFeaturedPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-pricings'] });
        },
    });
};

// Update Pricing
export const updateFeaturedPricing = async ({ id, data }: { id: number; data: UpdateFeaturedPricingPayload }): Promise<SingleFeaturedPricingResponse> => {
    const response = await apiClient.put<SingleFeaturedPricingResponse>(`/featured-listing/pricing/${id}`, data);
    return response.data;
};

export const useUpdateFeaturedPricing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateFeaturedPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-pricings'] });
            queryClient.invalidateQueries({ queryKey: ['featured-pricing'] });
        },
    });
};

// Delete Pricing
export const deleteFeaturedPricing = async (id: number): Promise<void> => {
    await apiClient.delete(`/featured-listing/pricing/${id}`);
};

export const useDeleteFeaturedPricing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteFeaturedPricing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-pricings'] });
        },
    });
};
