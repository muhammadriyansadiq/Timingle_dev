import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Select } from 'antd';

interface Option {
    label: string;
    value: string | number;
}

interface CustomSelectProps {
    name: string;
    control: Control<any>;
    placeholder?: string;
    options: Option[];
    className?: string;
    label?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    name,
    control,
    placeholder,
    options,
    className,
    label,
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
                    {label}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <Select
                            {...field}
                            id={name}
                            placeholder={placeholder}
                            className={`w-full h-12 ${className || ''} custom-select`}
                            status={error ? 'error' : ''}
                            options={options}
                            size="large" // Matches h-12 roughly
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};
