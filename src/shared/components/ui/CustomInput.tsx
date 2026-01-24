import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface CustomInputProps {
    name: string;
    control: Control<any>;
    placeholder?: string;
    prefix?: React.ReactNode;
    type?: 'text' | 'password' | 'number' | 'email' | 'tel';
    className?: string;
    description?: string; // For accessibility or extra info
    label?: string;
}

// ... imports
export const CustomInput: React.FC<CustomInputProps> = ({
    name,
    control,
    placeholder,
    prefix,
    type = 'text',
    className,
    label,
}) => {
    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>{label}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        {type === 'password' ? (
                            <Input.Password
                                {...field}
                                id={name}
                                prefix={prefix}
                                placeholder={placeholder}
                                className={`h-12 rounded-lg border-none bg-white ${className || ''}`}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                status={error ? 'error' : ''}
                            />
                        ) : (
                            <Input
                                {...field}
                                id={name}
                                type={type}
                                prefix={prefix}
                                placeholder={placeholder}
                                className={`h-12 bg-white border-none focus:border-none focus:ring-0 ${className || ''}`}
                                status={error ? 'error' : ''}
                            />
                        )}
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};
