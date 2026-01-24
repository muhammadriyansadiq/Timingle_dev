export interface PaymentTransaction {
    id: string;
    name: string;
    email: string;
    method: string;
    price: string;
    date: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface FinancialMetric {
    title: string;
    amount: string;
    trend: string;
    trendUp: boolean;
    data: { value: number }[];
    totalCount?: number; // For "Paid (2)"
}
