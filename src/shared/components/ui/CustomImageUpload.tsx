import React, { useRef, useState } from 'react';
import { CameraFilled } from '@ant-design/icons';
import { type Control, Controller } from 'react-hook-form';

interface CustomImageUploadProps {
    name: string;
    control: Control<any>;
    label?: string;
    className?: string;
}

export const CustomImageUpload: React.FC<CustomImageUploadProps> = ({ name, control, label, className }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => {
                    // Initialize preview if value is a string (URL) and preview is null
                    if (typeof value === 'string' && value && !preview) {
                        setPreview(value);
                    }

                    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setPreview(reader.result as string);
                                onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    };

                    return (
                        <div
                            onClick={handleContainerClick}
                            className="cursor-pointer w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity relative border-2 border-dashed border-gray-400"
                        >
                            {preview ? (
                                <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                            ) : (
                                <CameraFilled className="text-3xl text-orange-500" />
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    );
                }}
            />
        </div>
    );
};
