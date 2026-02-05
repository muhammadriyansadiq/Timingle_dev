
export interface FeaturedListingUser {
    id: number;
    phoneNumber: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface FeaturedListing {
    id: number;
    status: string;
    image: string;
    price: string;
    isComments: boolean;
    isChat: boolean;
    isFeaturedListing: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
    description: string | null;
    featuredPricingId: number | null;
    featuredPricing: any | null; // Replace 'any' with specific type if known
    user: FeaturedListingUser;
    type: string;
    petName: string;
}

export interface FeaturedListingResponse {
    statusCode: number;
    message: string;
    success: boolean;
    page: number;
    total: number;
    lastPage: number;
    data: FeaturedListing[];
}

export interface FeaturedListingFilters {
    page?: number;
    limit?: number;
    userId?: number;
    type?: string;
    petName?: string;
    role?: 'User' | 'Vendor' | 'Breader' | 'Admin' | 'Veterniary';
    minPrice?: number;
    maxPrice?: number;
    lang?: string;
}

export interface SingleFeaturedListingResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: FeaturedListing;
}

export interface UpdateFeaturedListingPayload {
    price?: number;
    status?: string;
    description?: string;
    petName?: string;
    type?: string;
    userId?: number;
}
