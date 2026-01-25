import React from 'react';
import { Modal } from 'antd';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            className="text-center rounded-2xl overflow-hidden"
        >
            <div className="p-4 flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 mb-6 text-center">{message}</p>

                <div className="flex gap-4 w-full justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 cursor-pointer py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
