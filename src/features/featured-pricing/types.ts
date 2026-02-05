export interface FeaturedPricing {
    id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    periodTime: string;
    monthlyPayment: string;
    discount: string;
    totalPayment: string;
}

export interface FeaturedPricingResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: FeaturedPricing[];
    page: number;
    total: number;
    lastPage: number;
}

export interface SingleFeaturedPricingResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: FeaturedPricing;
}

export interface CreateFeaturedPricingPayload {
    periodTime: string;
    monthlyPayment: number;
    discount: number;
    totalPayment: number;
}

export interface UpdateFeaturedPricingPayload {
    periodTime?: string;
    monthlyPayment?: number;
    discount?: number;
    totalPayment?: number;
    status?: string;
}

export interface FeaturedPricingFilters {
    page?: number;
    limit?: number;
}
