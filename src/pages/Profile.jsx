import { useState, useEffect } from 'react';
import SidebarComponent from '../components/SidebarComponent';
import dummyApi from '../services/dummyApi';
import {
    HiCamera,
    HiPencil,
    HiCheck,
    HiX,
    HiUser,
    HiMail,
    HiPhone,
    HiOfficeBuilding,
    HiUserGroup
} from 'react-icons/hi';
import { toast } from 'react-toastify';

// Loading Skeleton Components
const ProfilePhotoSkeleton = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm mb-8 flex flex-col items-center animate-pulse">
        <div className="w-40 h-40 rounded-full bg-gray-300 mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
    </div>
);

const FieldSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
        <div className="flex flex-col items-center mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
);

const Profile = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePhoto, setShowChangePhoto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [error, setError] = useState(null);

    // State untuk data profil
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        office: '',
        department: '',
    });

    const [editData, setEditData] = useState({ ...profileData });

    // Fetch profile data
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await dummyApi.get('/user');
            setProfileData(response.data);
            setEditData(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load profile data');
            setLoading(false);
            console.error('Error fetching profile:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profileData });
    };

    const handleSave = async () => {
        try {
            setLoadingAction(true);
            const response = await dummyApi.put('/user/update', editData);
            setProfileData(response.data);
            setIsEditing(false);
            toast.success('Profile berhasil diupdate!', {
                autoClose: 2000,
                style: { zIndex: 9999 }

            })
        } catch (error) {
            setError('Failed to update profile');
            console.error('Error updating profile:', error);
            toast.error('Profile gagal di update! Silahkan coba lagi.', {
                autoClose: 2000,
            });
        } finally {
            setLoadingAction(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...profileData });
    };

    const personalInfoFields = [
        { label: "Full Name", key: "name", icon: HiUser, type: "text", disabled: true },
        { label: "Email", key: "email", icon: HiMail, type: "email", disabled: true },
        { label: "Phone Number", key: "phone", icon: HiPhone, type: "tel", disabled: false }
    ];

    const workInfoFields = [
        { label: "Divisi", key: "office", icon: HiOfficeBuilding, type: "text", disabled: false },
        { label: "Grup", key: "department", icon: HiUserGroup, type: "text", disabled: false }
    ];

    const renderField = (field) => (
        <div key={field.key} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center mb-4">
                <field.icon className="w-8 h-8 text-blue-500 mb-2" />
                <label className="text-sm font-medium text-gray-600">
                    {field.label}
                </label>
            </div>
            {isEditing ? (
                <input
                    type={field.type}
                    value={editData[field.key]}
                    onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={field.disabled}
                />
            ) : (
                <p className="text-gray-800 text-center font-medium">{profileData[field.key]}</p>
            )}
        </div>
    );

    // Error state
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                        onClick={fetchProfileData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                activeItem="Profile"
            />

            <main className={`flex-1 overflow-x-hidden transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                            <p className="text-gray-500">Kelola informasi profil Anda</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <HiPencil className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={loadingAction}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                    >
                                        {loadingAction ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                Saving...
                                            </div>
                                        ) : (
                                            <>
                                                <HiCheck className="w-4 h-4 mr-2" />
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loadingAction}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        <HiX className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="grid gap-8">
                        {/* Profile Photo Card */}
                        {loading ? (
                            <ProfilePhotoSkeleton />
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm mb-8 flex flex-col items-center">
                                <div className="relative">
                                    <div
                                        className="w-40 h-40 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold"
                                        onMouseEnter={() => setShowChangePhoto(true)}
                                        onMouseLeave={() => setShowChangePhoto(false)}
                                    >
                                        {profileData.name.split(' ').map(word => word[0]).join('')}
                                        {showChangePhoto && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer">
                                                <HiCamera className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-800">{profileData.name}</h2>
                                <p className="text-gray-500">{profileData.department}</p>
                            </div>
                        )}

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {loading
                                    ? personalInfoFields.map((_, index) => <FieldSkeleton key={index} />)
                                    : personalInfoFields.map(renderField)}
                            </div>
                        </div>


                        {/* Work Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Work Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {loading
                                    ? workInfoFields.map((_, index) => <FieldSkeleton key={index} />)
                                    : workInfoFields.map(renderField)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;