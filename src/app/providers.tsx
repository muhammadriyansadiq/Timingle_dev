import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#a26cf7',
                            fontFamily: 'Poppins, sans-serif',
                        },
                    }}
                >
                    {children}
                </ConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
};
