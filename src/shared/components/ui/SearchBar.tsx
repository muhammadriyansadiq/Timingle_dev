import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (value: string) => void;
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search here...",
    onSearch,
    className,
}) => {
    return (
        <div className={`relative ${className || ''}`}>
            <Input
                placeholder={placeholder}
                prefix={<SearchOutlined className="text-xl !text-primary mr-2" />}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="rounded-full outline-0 border-none bg-white  py-2 px-4 h-12 text-gray-700 hover:bg-gray-50 focus:bg-white"
                style={{
                    backgroundColor: '#FDF8F0',
                    border: "none"
                }}
            />
        </div>
    );
};
