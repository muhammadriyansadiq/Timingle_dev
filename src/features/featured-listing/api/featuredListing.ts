import { apiClient } from '../../../shared/api/axios-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FeaturedListingFilters, FeaturedListingResponse, SingleFeaturedListingResponse, UpdateFeaturedListingPayload } from '../types';

export const getFeaturedListings = async (filters: FeaturedListingFilters): Promise<FeaturedListingResponse> => {
    const params = {
        ...filters,
    };
    const response = await apiClient.get<FeaturedListingResponse>('/featured-listing', { params });
    return response.data;
};

export const useFeaturedListings = (filters: FeaturedListingFilters) => {
    return useQuery({
        queryKey: ['featured-listings', filters],
        queryFn: () => getFeaturedListings(filters),
    });
};

// Fetch single featured listing by ID
export const getFeaturedListing = async (id: number): Promise<SingleFeaturedListingResponse> => {
    const response = await apiClient.get<SingleFeaturedListingResponse>(`/featured-listing/${id}`);
    return response.data;
};

export const useFeaturedListing = (id: number | null) => {
    return useQuery({
        queryKey: ['featured-listing', id],
        queryFn: () => getFeaturedListing(id!),
        enabled: !!id,
    });
};

// Update Featured Listing
export const updateFeaturedListing = async ({ id, data }: { id: number; data: UpdateFeaturedListingPayload }): Promise<SingleFeaturedListingResponse> => {
    const response = await apiClient.put<SingleFeaturedListingResponse>(`/featured-listing/${id}`, data);
    return response.data;
};

export const useUpdateFeaturedListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateFeaturedListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-listings'] });
            queryClient.invalidateQueries({ queryKey: ['featured-listing'] });
        },
    });
};

// Delete Featured Listing
export const deleteFeaturedListing = async (id: number): Promise<void> => {
    await apiClient.delete(`/featured-listing/${id}`);
};

export const useDeleteFeaturedListing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteFeaturedListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['featured-listings'] });
        },
    });
};
