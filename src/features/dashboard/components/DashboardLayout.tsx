import React, { useState } from 'react';
import { Drawer } from 'antd';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = () => {
        // Simple check for mobile viewport
        if (window.innerWidth < 768) {
            setMobileMenuOpen(true);
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <div className="flex min-h-screen bg-admindashboardcolor">
            {/* Desktop Sidebar */}
            <Sidebar collapsed={collapsed} />

            {/* Mobile Sidebar (Drawer) */}
            <Drawer
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                closable={false}
                bodyStyle={{ padding: 0 }}
                width={256}
            >
                <div className="h-full bg-[#fdf8f0]">
                    <Sidebar mobile />
                </div>
            </Drawer>

            <div className={`flex-1 ml-0 ${collapsed ? 'md:ml-20' : 'md:ml-64'} flex flex-col w-full transition-all duration-300`}>
                <Topbar onMenuClick={handleMenuClick} />
                <div className="p-4 md:p-8 space-y-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
