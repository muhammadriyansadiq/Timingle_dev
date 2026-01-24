export interface Feed {
    id: string;
    name: string;
    email: string;
    date: string;
    type: string;
    status: 'Active' | 'Offline' | 'Suspended';
}
