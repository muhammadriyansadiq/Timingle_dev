export interface Veterinary {
    id: string;
    image?: string;
    name: string;
    email?: string; // Optional for card view if not shown, but needed for list
    date?: string;
    type?: string;
    status?: 'Active' | 'Offline' | 'Suspended';
}
