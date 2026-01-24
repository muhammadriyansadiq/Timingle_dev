export interface FeedRequest {
    id: string;
    userName: string;
    email: string;
    subject: string;
    received: string;
    status: 'New' | 'Open' | 'In Progress' | 'Close';
}
