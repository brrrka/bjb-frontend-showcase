import { useState } from 'react';
import {
    User,
    Lock,
    Mail,
    ArrowRight,
    Phone,
    Building2,
    Users2,
    Eye,
    EyeOff
} from 'lucide-react';
import dummyApi from '../services/dummyApi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../data/dataStore';

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        office: '',
        department: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const toggleView = () => setIsLogin(!isLogin);
    const togglePassword = () => setShowPassword(!showPassword);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        setError('');
        setPhoneError('');
        setPasswordError('');

        if (!/^\d{10,}$/.test(formData.phone) && !isLogin) {
            setPhoneError('Phone number must be at least 10 digits and contain only numbers.');
            isValid = false;
        }

        if (formData.password.length < 8) {
            setPasswordError('Password must be at least 8 characters.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            if (isLogin) {
                const loginSuccess = await login({
                    email: formData.email,
                    password: formData.password
                });

                if (loginSuccess) {
                    // Fetch data setelah login berhasil
                    try {
                        await useDataStore.getState().fetchExcelData('main');
                        await useDataStore.getState().fetchExcelData('qris_merchant');
                    } catch (error) {
                        console.error('Error fetching initial data:', error);
                        // Hilangkan toast error
                    }

                    toast.success('Login Berhasil! Mengarahkan ke Dashboard...', {
                        position: "top-right",
                        autoClose: 2000,
                    });

                    // Langsung arahkan ke dashboard
                    navigate('/dashboard');
                }
            } else {
                // Kode registrasi tetap sama
                await dummyApi.post('/register', {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    office: formData.office,
                    department: formData.department,
                    password: formData.password,
                });
                toast.success('Registrasi Berhasil! Silahkan Login', {
                    position: "top-right",
                    autoClose: 2000,
                });
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
            toast.error('Terjadi Kesalahan, Silahkan Coba Lagi', {
                position: "top-right",
                autoClose: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[url('/images/background.svg')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="flex bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="w-[400px] p-8">
                    <div className="flex justify-center mb-8">
                        <img src='/images/Bank_BJB_logo.svg' alt="Bank BJB Logo" className="h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        {isLogin ? 'Login to Your Account' : 'Create New Account'}
                    </h2>
                    {isLogin && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
                            <p className="text-xs text-blue-700">Email: demo@bjb.co.id</p>
                            <p className="text-xs text-blue-700">Password: password123</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 text-sm text-center mb-4">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                />
                                <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                        </div>
                        {!isLogin && (
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                />
                                <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                            </div>
                        )}
                        {phoneError && (
                            <div className="text-red-600 text-sm text-center mb-4">
                                {phoneError}
                            </div>
                        )}
                        {!isLogin && (
                            <div className="relative">
                                <input
                                    type="text"
                                    name="office"
                                    value={formData.office}
                                    onChange={handleChange}
                                    placeholder="Divisi"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                />
                                <Building2 className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                            </div>
                        )}
                        {!isLogin && (
                            <div className="relative">
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Grup"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                />
                                <Users2 className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-4 top-3.5"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <div className="text-red-600 text-sm text-center mb-4">
                                {passwordError}
                            </div>
                        )}
                        {isLogin && (
                            <div className="flex justify-end">
                                <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`w-full bg-yellow-400 hover:bg-yellow-600 text-blue-800 font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={isLoading} // Tombol dinonaktifkan saat loading
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-blue-800"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={toggleView}
                                className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPages;
