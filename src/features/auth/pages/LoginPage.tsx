import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center  bg-background pt-16">
            {/* Logo would go here */}
            <picture className='mb-8'>
                <img src="login.png" alt="" />
            </picture>
            <h1 className="text-2xl font-poppins text-gray-800 font-bold mb-8">Login your account!</h1>
            {/* <div className="w-16 h-1 bg-gray-300 mb-8 rounded-full"></div> Separator styling if needed, or just space */}

            <LoginForm />
        </div>
    );
};
