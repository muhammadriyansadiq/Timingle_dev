import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomButton } from '../../../shared/components/ui/CustomButton';
import { useLogin } from '../api/auth';
import { message } from 'antd';

const loginSchema = z.object({
    identifier: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: login, isPending } = useLogin();
    const { control, handleSubmit } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    });

    const onSubmit = (data: LoginSchema) => {
        login(data, {
            onSuccess: () => {
                message.success('Login successful!');
                navigate('/dashboard');
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
                message.error(errorMessage);
            },
        });
    };

    return (
        <div className="bg-transparent sm:w-9/12 md:max-w-md w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <CustomInput
                    name="identifier"
                    control={control}
                    type="email"
                    placeholder="Email"
                    prefix={<MailOutlined className="text-gray-400 mr-2" />}
                />

                <CustomInput
                    name="password"
                    control={control}
                    placeholder="Password"
                    type="password"
                    prefix={<LockOutlined className="text-gray-400 mr-2" />}
                />

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-text hover:text-black">
                        Forgot password?
                    </Link>
                </div>

                <CustomButton
                    htmlType="submit"
                    block
                    loading={isPending}
                    variant="primary"
                >
                    Continue
                </CustomButton>

            </form>
            <div className='mt-4 flex justify-end text-text '>Don't have an account? <Link to="/signup" className='text-primary ml-2'>Sign Up</Link></div>

        </div>
    );
};
