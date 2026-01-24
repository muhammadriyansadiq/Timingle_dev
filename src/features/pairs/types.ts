export interface Pair {
    id: string;
    image?: string; // URL or base64
    pairsName: string;
    owner: string;
    date: string;
    type: 'Breeder' | 'Vendor';
    status: 'Paid' | 'Not Pay';
}
