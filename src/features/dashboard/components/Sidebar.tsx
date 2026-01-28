import React from 'react';
import {
    DashboardOutlined, UserOutlined, ShopOutlined,
    DeploymentUnitOutlined, MedicineBoxOutlined,
    ShoppingCartOutlined, FileTextOutlined,
    SettingOutlined, LogoutOutlined, FormOutlined, UnorderedListOutlined, PictureOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import "./style.css";
const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/users', icon: <UserOutlined />, label: 'User Management', hasSubmenu: true },
    { key: '/listing', icon: <UnorderedListOutlined />, label: 'Listing' },
    { key: '/promotion-banner', icon: <PictureOutlined />, label: 'Promotion Banner' },
    { key: '/vendors', icon: <ShopOutlined />, label: 'Vendors' },
    { key: '/pairs', icon: <UserOutlined />, label: 'Pairs Manager' },
    { key: '/breeders', icon: <DeploymentUnitOutlined />, label: 'Breeders' },
    // { key: '/breeders', icon: <DeploymentUnitOutlined />, label: 'Breeders' },
    {
        key: '/veterinary',
        icon: <MedicineBoxOutlined />,
        label: 'Veterinary',
        hasSubmenu: true,
        children: [
            { key: '/veterinary/list', label: 'Veterinary List' },
            { key: '/veterinary/top', label: 'Top Veterinary' },
        ]
    },
    { key: '/payments', icon: <ShoppingCartOutlined />, label: 'Payments' },
    { key: '/feeds', icon: <FormOutlined />, label: 'Feeds' },
    { key: '/reports', icon: <FileTextOutlined />, label: 'Report' },
    { key: '/requests', icon: <FileTextOutlined />, label: 'Requests' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

interface SidebarProps {
    mobile?: boolean;
    collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile, collapsed }) => {
    const location = useLocation();
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

    const toggleSubmenu = (key: string) => {
        setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const baseClasses = "bg-admindashboardcolor border-r border-gray-300 flex-col overflow-y-auto transition-all duration-300 custom-scrollbar";
    const desktopClasses = `h-screen fixed left-0 top-0 hidden md:flex ${collapsed ? 'w-20' : 'w-64'}`;
    const mobileClasses = "w-full h-full flex";

    return (
        <div className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}>
            <div className={`p-6 ${collapsed ? 'flex justify-center px-2' : ''}`}>
                <picture>
                    <img src="login.png" alt="" className={collapsed ? "w-10 h-10 object-contain" : ""} />
                </picture>
                {/* <h1 className="text-3xl font-bold text-yellow-500 font-poppins italic">Imingle</h1> */}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.key || (item.children && item.children.some(child => location.pathname === child.key));
                    const isOpen = openSubmenus[item.key];

                    if (item.children) {
                        return (
                            <div key={item.key}>
                                <div
                                    onClick={() => toggleSubmenu(item.key)}
                                    className={`flex items-center justify-between cursor-pointer ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-colors ${isActive ? 'bg-purple-50 text-primary' : 'text-text hover:text-primary hover:bg-purple-50'}`}
                                    title={collapsed ? item.label : ''}
                                >
                                    <div className="flex items-center">
                                        <span className={`text-lg ${collapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                                        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                                    </div>
                                    {!collapsed && (
                                        <span className="text-xs">
                                            {isOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
                                        </span>
                                    )}
                                </div>
                                {isOpen && !collapsed && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.key}
                                                to={child.key}
                                                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${location.pathname === child.key
                                                    ? 'bg-primary text-white shadow-md font-medium'
                                                    : 'text-gray-500 hover:text-primary hover:bg-purple-50'
                                                    }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.key}
                            to={item.key}
                            title={collapsed ? item.label : ''}
                            className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'text-text hover:bg-orange-100'
                                }`}
                        >
                            <span className={`text-lg ${collapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-text hover:text-red-500 transition-colors w-full`}>
                    <LogoutOutlined className={`text-lg ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </div>
    );
};
