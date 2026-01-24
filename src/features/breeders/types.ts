export interface Breeder {
    id: string;
    name: string;
    email: string;
    date: string;
    type: string;
    status: 'Active' | 'Offline' | 'Suspended';
}
