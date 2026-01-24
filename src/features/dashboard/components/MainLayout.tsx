import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';

export const MainLayout: React.FC = () => {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};
