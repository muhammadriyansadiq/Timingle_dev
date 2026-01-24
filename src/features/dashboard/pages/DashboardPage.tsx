import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { Progress } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
// import { DashboardLayout } from '../components/DashboardLayout';

const dataVisitor = [
    { name: 'Jan', loyal: 100, new: 200, unique: 150 },
    { name: 'Feb', loyal: 120, new: 210, unique: 160 },
    { name: 'Mar', loyal: 150, new: 250, unique: 180 },
    { name: 'Apr', loyal: 130, new: 230, unique: 170 },
    { name: 'May', loyal: 170, new: 270, unique: 190 },
    { name: 'Jun', loyal: 180, new: 280, unique: 200 },
];

const OverviewCard = ({ title, value, subtext, color, icon }: any) => (
    <div className={`p-6 rounded-2xl ${color} text-left h-full shadow-sm hover:shadow-md transition-shadow`}>
        {icon && <div className="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center mb-4 text-white">
            {icon}
        </div>}
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-sm text-gray-600 font-semibold">{title}</p>
        <p className="text-xs text-blue-500 mt-2">{subtext}</p>
    </div>
);

export const DashboardPage: React.FC = () => {
    return (
        <>
            {/* Overview Cards */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-poppins">Dashboard</h2>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-4 rounded-lg">
                <OverviewCard title="Total Listing" value="1k" subtext="+8% from yesterday" color="bg-blue-300" icon={<ArrowUpOutlined />} />
                <OverviewCard title="Vendors" value="300" subtext="+5% from yesterday" color=" bg-green-300" icon={<ArrowUpOutlined />} />
                <OverviewCard title="Veterinary" value="15" subtext="+1.2% from yesterday" color="bg-green-100" icon={<ArrowUpOutlined />} />
                <OverviewCard title="New Users" value="8" subtext="0.5% from yesterday" color="bg-yellow-100" icon={<ArrowUpOutlined />} />
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visitor Insights - Taking 2 cols */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Visitor Insights</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dataVisitor}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="loyal" stroke="#8884d8" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="new" stroke="#ff8042" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="unique" stroke="#82ca9d" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Customer Satisfaction */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Satisfaction</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={dataVisitor}>
                            <Area type="monotone" dataKey="loyal" stroke="#00C49F" fill="#00C49F" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Upgrade */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Total Upgrade</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dataVisitor}>
                            <Bar dataKey="loyal" fill="#ff7300" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="new" fill="#387908" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Listing */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Listing</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Birds</span>
                            <Progress percent={45} strokeColor="#d4a373" showInfo={false} className="w-1/2" />
                            <span className="text-xs bg-orange-100 px-2 py-1 rounded">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Cats</span>
                            <Progress percent={29} strokeColor="#52c41a" showInfo={false} className="w-1/2" />
                            <span className="text-xs bg-green-100 px-2 py-1 rounded">29%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Dogs</span>
                            <Progress percent={18} strokeColor="#722ed1" showInfo={false} className="w-1/2" />
                            <span className="text-xs bg-purple-100 px-2 py-1 rounded">18%</span>
                        </div>
                    </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Users Mapping by Country</h3>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        Map Placeholder
                    </div>
                </div>
            </div>
        </>
    );
};
