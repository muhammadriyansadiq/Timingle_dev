import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    MailOutlined, LockOutlined, UserOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CustomInput } from '../../../shared/components/ui/CustomInput';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(3, 'phone must be at least 6 characters'),

    username: z.string().min(3, 'username must be at least 6 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const SignupForm: React.FC = () => {
    const { control, handleSubmit } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginSchema) => {
        console.log(data);
        // TODO: Implement login logic
    };

    return (
        <div className=" bg-transparent sm:w-9/12 md:max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <CustomInput
                    name="username"
                    control={control}
                    placeholder="Username"
                    prefix={<UserOutlined className="text-gray-400 mr-2" />}
                />

                <CustomInput
                    name="email"
                    control={control}
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

                <CustomInput
                    name="phone"
                    control={control}
                    placeholder="Phone"
                    type="number"
                    prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                />

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-text hover:text-black">
                        Forgot password?
                    </Link>
                </div>


                <div
                    className="
    flex items-center justify-center text-whitecolor w-full
    max-w-full
    sm:max-w-md
    lg:max-w-lg
    xl:max-w-[464px]
    /* padding */
    px-3 py-2
    sm:px-4 sm:py-3
    lg:px-5 lg:py-2

    /* gap */
    gap-2
    sm:gap-3
    lg:gap-4

    /* height control */
    min-h-[48px]
    sm:min-h-[56px]
    lg:min-h-[42px]

    /* radius */
    rounded-full

    /* color */
    bg-[#A26CF7]
    text-sm
  "
                >
                    Continue
                </div>

            </form>
            <div className='mt-4 flex justify-end text-text '>Already have an account? <Link to="/login" className='text-primary ml-2'>Sign in</Link></div>

        </div>
    );
};



// import React, { useState } from 'react';
// // import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import { MailOutlined, LockOutlined, FacebookFilled, GoogleOutlined, AppleFilled, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// export default function LoginForm() {
//     const [activeTab, setActiveTab] = useState('email');
//     const [showPassword, setShowPassword] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//                 {/* Logo */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold">
//                         <span className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-transparent bg-clip-text italic">
//                             Invingle
//                         </span>
//                     </h1>
//                 </div>

//                 {/* Title */}
//                 <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
//                     Login your account!
//                 </h2>

//                 {/* Tabs */}
//                 <div className="flex mb-6 border-b border-gray-200">
//                     <button
//                         onClick={() => setActiveTab('email')}
//                         className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === 'email'
//                             ? 'text-gray-800'
//                             : 'text-gray-400'
//                             }`}
//                     >
//                         E-mail
//                         {activeTab === 'email' && (
//                             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600"></div>
//                         )}
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('mobile')}
//                         className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${activeTab === 'mobile'
//                             ? 'text-gray-800'
//                             : 'text-gray-400'
//                             }`}
//                     >
//                         Mobile Number
//                         {activeTab === 'mobile' && (
//                             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600"></div>
//                         )}
//                     </button>
//                 </div>

//                 {/* Email Input */}
//                 <div className="mb-4">
//                     <div className="relative">
//                         <MailOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                             type="email"
//                             placeholder="Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                         />
//                     </div>
//                 </div>

//                 {/* Password Input */}
//                 <div className="mb-2">
//                     <div className="relative">
//                         <LockOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                         >
//                             {showPassword ? <EyeInvisibleOutlined className="w-5 h-5" /> : <EyeTwoTone className="w-5 h-5" />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Forgot Password */}
//                 <div className="text-right mb-6">
//                     <a href="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
//                         Forgot password?
//                     </a>
//                 </div>

//                 {/* Continue Button */}
//                 <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-6">
//                     Continue
//                 </button>

//                 {/* Sign in with */}
//                 <div className="text-center mb-4">
//                     <span className="text-sm text-gray-500">Sign in with</span>
//                 </div>

//                 {/* Social Login Buttons */}
//                 <div className="flex justify-center gap-4 mb-6">
//                     <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
//                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                         </svg>
//                     </button>
//                     <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-md hover:shadow-lg">
//                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                         </svg>
//                     </button>
//                     <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg">
//                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Sign Up Link */}
//                 <div className="text-center">
//                     <span className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
//                             Sign up
//                         </a>
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }


// import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Input, Button, Checkbox } from 'antd';
// import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, FacebookFilled, GoogleOutlined, AppleFilled, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
// import { Link } from 'react-router-dom';

// const signupSchema = z.object({
//     username: z.string().min(3, 'Username must be at least 3 characters'),
//     email: z.string().email('Invalid email address'),
//     phone: z.string().min(10, 'Phone number must be valid'),
//     password: z.string().min(6, 'Password must be at least 6 characters'),
//     rememberMe: z.boolean().optional(),
// });

// type SignupSchema = z.infer<typeof signupSchema>;

// export const SignupForm: React.FC = () => {
//     const { control, handleSubmit, formState: { errors } } = useForm<SignupSchema>({
//         resolver: zodResolver(signupSchema),
//     });

//     const onSubmit = (data: SignupSchema) => {
//         console.log(data);
//         // TODO: Implement signup logic
//     };

//     return (
//         <div className="w-full max-w-md bg-transparent">
//             <h2 className="text-xs font-bold text-gray-800 mb-4 text-center">Enter your Full Details</h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <div>
//                     <Controller
//                         name="username"
//                         control={control}
//                         render={({ field }) => (
//                             <Input
//                                 {...field}
//                                 prefix={<UserOutlined className="text-gray-400 mr-2" />}
//                                 placeholder="Username"
//                                 className="h-12 rounded-lg border-none shadow-sm bg-white"
//                                 status={errors.username ? 'error' : ''}
//                             />
//                         )}
//                     />
//                     {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
//                 </div>

//                 <div>
//                     <Controller
//                         name="email"
//                         control={control}
//                         render={({ field }) => (
//                             <Input
//                                 {...field}
//                                 prefix={<MailOutlined className="text-gray-400 mr-2" />}
//                                 placeholder="Email"
//                                 className="h-12 rounded-lg border-none shadow-sm bg-white"
//                                 status={errors.email ? 'error' : ''}
//                             />
//                         )}
//                     />
//                     {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//                 </div>

//                 <div>
//                     <Controller
//                         name="phone"
//                         control={control}
//                         render={({ field }) => (
//                             <Input
//                                 {...field}
//                                 prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
//                                 placeholder="Phone"
//                                 className="h-12 rounded-lg border-none shadow-sm bg-white"
//                                 status={errors.phone ? 'error' : ''}
//                             />
//                         )}
//                     />
//                     {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//                 </div>

//                 <div>
//                     <Controller
//                         name="password"
//                         control={control}
//                         render={({ field }) => (
//                             <Input.Password
//                                 {...field}
//                                 prefix={<LockOutlined className="text-gray-400 mr-2" />}
//                                 placeholder="Password"
//                                 className="h-12 rounded-lg border-none shadow-sm bg-white"
//                                 iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
//                                 status={errors.password ? 'error' : ''}
//                             />
//                         )}
//                     />
//                     {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//                 </div>

//                 <div className="flex items-center">
//                     <Controller
//                         name="rememberMe"
//                         control={control}
//                         render={({ field: { value, onChange, ...field } }) => (
//                             <Checkbox checked={value} onChange={onChange} {...field} className="text-gray-500 text-xs">
//                                 Remember me
//                             </Checkbox>
//                         )}
//                     />
//                 </div>

//                 <Button
//                     type="primary"
//                     htmlType="submit"
//                     className="w-full h-12 rounded-full text-base font-semibold shadow-md hover:opacity-90 transition-opacity mt-4"
//                     style={{ backgroundColor: '#a26cf7', borderColor: '#a26cf7' }}
//                 >
//                     Continue
//                 </Button>
//             </form>

//             <div className="mt-8 text-center">
//                 <p className="text-xs text-gray-500 mb-4">Sign In With</p>
//                 <div className="flex justify-center space-x-6">
//                     <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-blue-600">
//                         <FacebookFilled style={{ fontSize: '24px' }} />
//                     </button>
//                     <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-red-500">
//                         <GoogleOutlined style={{ fontSize: '24px' }} />
//                     </button>
//                     <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-black">
//                         <AppleFilled style={{ fontSize: '24px' }} />
//                     </button>
//                 </div>

//                 <p className="mt-8 text-xs text-gray-600">
//                     Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };
