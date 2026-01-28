import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    htmlType?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    block?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    onClick,
    htmlType = 'button',
    loading = false,
    disabled = false,
    className = '',
    variant = 'primary',
    block = false,
}) => {

    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                // Exact styling from user request
                return 'bg-[#A26CF7] text-whitecolor hover:bg-buttonbgcolor';
            case 'secondary':
                return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
            case 'outline':
                return 'bg-transparent border border-[#A26CF7] text-[#A26CF7] hover:bg-purple-50';
            case 'danger':
                return 'bg-red-500 hover:bg-red-600 text-white';
            default:
                return 'bg-[#A26CF7] text-whitecolor';
        }
    };

    return (
        <button
            type={htmlType}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                flex items-center justify-center
                ${getVariantClasses()}
                ${block ? 'w-full' : ''}
                
                /* User spec - padding */
                px-3 py-2
                sm:px-4 sm:py-3
                lg:px-5 lg:py-2

                /* User spec - gap */
                gap-2
                sm:gap-3
                lg:gap-4

                /* User spec - height */
                min-h-[48px]
                sm:min-h-[56px]
                lg:min-h-[42px]

                /* User spec - radius */
                rounded-full

                /* User spec - misc */
                text-sm font-medium
                
                transition-all
                cursor-pointer
                disabled:opacity-70 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {loading && <LoadingOutlined className="animate-spin" />}
            {children}
        </button>
    );
};
