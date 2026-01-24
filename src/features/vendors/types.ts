export interface Vendor {
    id: string;
    name: string;
    email: string;
    date: string;
    type: string;
    status: 'Active' | 'Offline' | 'Suspended';
}
