import React from 'react';
import { EditOutlined, DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import type { PromotionBanner } from '../types';
import { Link } from 'react-router-dom';

interface PromotionBannerCardProps {
    banner: PromotionBanner;
    onEdit: (banner: PromotionBanner) => void;
    onDelete: (banner: PromotionBanner) => void;
    onToggleActive: (banner: PromotionBanner) => void;
}

export const PromotionBannerCard: React.FC<PromotionBannerCardProps> = ({ banner, onEdit, onDelete, onToggleActive }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row h-full md:h-48 border border-gray-100 hover:shadow-md transition-shadow">
            {/* Image Section */}
            <div className="md:w-1/3 h-48 md:h-full relative overflow-hidden">
                <Link to={banner.link}>
                    <img
                        src={banner.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                </Link>
                <div className="absolute top-2 left-2 inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none md:hidden" />
                <div className="absolute bottom-2 left-2 text-white font-bold md:hidden">
                    {banner.title}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${banner.isActive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                {banner.isActive ? 'Spring Sale' : 'Inactive'}
                            </span>
                            {/* Note: 'Spring Sale' is hardcoded based on design, practically this might be dynamic or just 'Active' */}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-2 line-clamp-1">{banner.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{banner.description}</p>

                </div>

                {/* Actions */}
                <div className="flex items-center  mt-4 pt-4 border-t border-gray-100 justify-between">
                    <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-purple-600" onClick={() => onToggleActive(banner)}>
                        <Switch size="small" checked={banner.isActive} />
                        <span className="text-sm font-medium">Active</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => onEdit(banner)}>
                        <EditOutlined />
                        <span className="text-sm font-medium">Edit</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-red-600" onClick={() => onDelete(banner)}>
                        <DeleteOutlined />
                        <span className="text-sm font-medium">Remove</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
