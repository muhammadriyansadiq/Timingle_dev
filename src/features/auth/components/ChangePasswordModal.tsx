import React, { useEffect } from 'react';
import { message, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import { useResetPassword } from '../api/auth';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

const changePasswordSchema = z.object({
    email: z.string().email(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, email }) => {
    const { mutate: resetPassword, isPending } = useResetPassword();

    const { control, handleSubmit, reset } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            email: email,
            newPassword: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                email: email,
                newPassword: '',
            });
        }
    }, [isOpen, email, reset]);

    const onSubmit = (data: ChangePasswordSchema) => {
        resetPassword(data, {
            onSuccess: () => {
                message.success('Password changed successfully');
                onClose();
            },
            onError: () => {
                message.error('Failed to change password');
            }
        });
    };

    return (
        <Modal
            title="Change Password"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <CustomInput
                    label="Email"
                    name="email"
                    control={control}
                    placeholder="Email"
                    disabled
                />
                <CustomInput
                    label="New Password"
                    name="newPassword"
                    control={control}
                    placeholder="Enter new password"
                    type="password"
                />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <CustomButton
                        htmlType="submit"
                        loading={isPending}
                        disabled={isPending}
                        variant="primary"
                        className="h-10! px-4! rounded-lg"
                    >
                        Change Password
                    </CustomButton>
                </div>
            </form>
        </Modal>
    );
};
