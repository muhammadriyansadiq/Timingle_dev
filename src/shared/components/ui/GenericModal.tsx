import React from 'react';
import { Modal } from 'antd';

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number;
    footer?: React.ReactNode;
}

export const GenericModal: React.FC<GenericModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = 520,
    footer = null,
}) => {
    return (
        <Modal
            title={<div className="text-lg font-bold">{title}</div>}
            open={isOpen}
            onCancel={onClose}
            footer={footer}
            width={width}
            centered
            destroyOnClose
            className="rounded-2xl overflow-hidden"
        >
            <div className="py-4">
                {children}
            </div>
        </Modal>
    );
};
