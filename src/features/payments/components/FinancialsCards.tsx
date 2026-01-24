import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface CardData {
    title: string;
    amount: string;
    subtitle?: string;
    trend: string;
    isPositive: boolean;
    data: { value: number }[];
    highlightCount?: number; // e.g., the (2) in Paid (2)
}

const Card: React.FC<CardData> = ({ title, amount, subtitle, trend, isPositive, data, highlightCount }) => {
    // Determine bar color based on trend (greenish for all based on image, but maybe slightly different shades)
    // The image shows orange/gray bars. Let's try to match that.
    // Active bars seem orange, inactive gray. Or maybe random. 
    // Image shows mostly gray and orange bars. Let's alternate or plain orange.
    // Actually, image has orange active bars. Let's just use orange.

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-48 min-w-[300px] flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-1">
                        {title}
                        {highlightCount !== undefined && <span className="text-green-500 text-base">({highlightCount})</span>}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{subtitle || 'Total amount'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900">{amount}</h2>
                    <div className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isPositive ? '↗' : '↘'} {trend}
                    </div>
                </div>
            </div>

            <div className="h-16 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#fbbf24' : '#9ca3af'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const FinancialsCards: React.FC = () => {
    // Mock data for charts
    const data1 = Array(15).fill(0).map(() => ({ value: Math.random() * 100 }));
    const data2 = Array(15).fill(0).map(() => ({ value: Math.random() * 100 }));
    const data3 = Array(15).fill(0).map(() => ({ value: Math.random() * 100 }));

    return (
        <div className="flex gap-6 mb-8 flex-wrap">
            <Card
                title="Total Payments"
                amount="$2460.0"
                subtitle="Total earnings from all payments"
                trend="20.9%"
                isPositive={true}
                data={data1}
            />
            <Card
                title="Pending Payments"
                amount="$1500.0"
                subtitle="Total amount in unpaid invoices"
                trend="5.9%"
                isPositive={false}
                data={data2}
            />
            <Card
                title="Paid"
                highlightCount={2}
                amount="960.0"
                subtitle="Total amount in paid invoices"
                trend="20.9%"
                isPositive={true}
                data={data3}
            />
        </div>
    );
};
