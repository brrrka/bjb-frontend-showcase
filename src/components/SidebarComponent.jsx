import { HiPresentationChartBar, HiOfficeBuilding, HiCash, HiUserCircle, HiQrcode, HiArrowSmRight, HiHome, HiDocument, HiUsers, HiQuestionMarkCircle } from 'react-icons/hi';
import { HiChevronLeft, HiChevronRight, HiChevronDown, HiChevronUp, HiMenu, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useUserStore from '../data/userStore';

const SidebarComponent = ({ onCollapse }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [menuItems, setMenuItems] = useState([]);

    const { userData, fetchUserData, clearUserData } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Check for mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // Auto collapse on mobile
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
                setIsOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Same menu items as before...
    const allMenuItems = [
        { icon: HiHome, text: "Ringkasan", roles: ['admin', 'user', 'guest'] },
        { icon: HiPresentationChartBar, text: "Konsolidasi", roles: ['admin', 'user', 'guest'] },
        {
            icon: HiOfficeBuilding,
            text: "Pencapaian Kanwil",
            hasDropdown: true,
            roles: ['admin', 'user', 'guest'],
            subItems: [
                "Kanwil 1",
                "Kanwil 2",
                "Kanwil 3",
                "Kanwil 4",
                "Kanwil 5",
            ]
        },
        { icon: HiCash, text: "Fee Based Income", roles: ['admin', 'user', 'guest'] },
        { icon: HiQrcode, text: "QRIS Merchants", roles: ['admin', 'user', 'guest'] },
        { icon: HiDocument, text: "Files", roles: ['admin', 'user'] },
        { icon: HiUserCircle, text: "Profile", roles: ['admin', 'user', 'guest'] },
        { icon: HiUsers, text: "User Management", roles: ['admin'] },
        { icon: HiQuestionMarkCircle, text: "Panduan", roles: ['admin', 'user', 'guest'] },
    ];

    useEffect(() => {
        if (!userData) {
            fetchUserData();
            // Show all items for admin by default while loading
            const filteredItems = allMenuItems.filter(item =>
                item.roles.includes('admin')
            );
            setMenuItems(filteredItems);
        } else {
            const userRole = userData.role || 'admin'; // Default to admin for demo
            const filteredItems = allMenuItems.filter(item =>
                item.roles.includes(userRole)
            );
            setMenuItems(filteredItems);
        }
    }, [userData, fetchUserData, allMenuItems]);

    const handleSignOut = async () => {
        try {
            const success = await logout();
            if (success) {
                clearUserData();
                toast.success('Logout Berhasil!', {
                    position: 'top-right',
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1200);
            } else {
                toast.error('Logout Gagal! Silahkan Coba Lagi', {
                    position: 'top-right',
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout Gagal! Silahkan Coba Lagi', {
                autoClose: 2000
            });
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        if (isMobile) {
            setIsCollapsed(false);
        }
    };

    const handleCollapse = () => {
        if (!isMobile) {
            setIsCollapsed(!isCollapsed);
            setOpenDropdowns({});
            onCollapse && onCollapse(!isCollapsed);
        }
    };

    const handleDropdownClick = (e, itemText) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdowns(prev => ({
            ...prev,
            [itemText]: !prev[itemText]
        }));
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setIsOpen(false);
        }
    };

    // Rest of the handlers remain the same...
    const handleMenuClick = (item) => {
        if (item.hasDropdown) {
            handleDropdownClick(event, item.text);
            return;
        }

        switch (item.text) {
            case "Ringkasan":
                handleNavigation("/dashboard");
                break;
            case "Konsolidasi":
                handleNavigation("/dashboard/konsolidasi");
                break;
            case "Profile":
                handleNavigation("/dashboard/profile");
                break;
            case "Fee Based Income":
                handleNavigation("/dashboard/feebased");
                break;
            case "QRIS Merchants":
                handleNavigation("/dashboard/qris");
                break;
            case "Files":
                handleNavigation("/dashboard/files");
                break;
            case "User Management":
                handleNavigation("/dashboard/users");
                break;
            case "Panduan":  // Tambahkan case untuk Panduan
                handleNavigation("/dashboard/panduan");
                break;
            default:
                break;
        }
    };

    const handleSubItemClick = (subItem) => {
        const region = subItem.toLowerCase().replace(' ', '');
        handleNavigation(`/dashboard/${region}`);
    };

    // Active state logic remains the same...
    const currentPath = location.pathname;
    const getIsActive = (item) => {
        if (item.text === "Ringkasan") return currentPath === "/dashboard";
        if (item.text === "Konsolidasi") return currentPath === "/dashboard/konsolidasi";
        if (item.text === "Fee Based Income") return currentPath === "/dashboard/feebased";
        if (item.text === "QRIS Merchants") return currentPath === "/dashboard/qris";
        if (item.text === "Profile") return currentPath === "/dashboard/profile";
        if (item.text === "User Management") return currentPath === "/dashboard/users";
        if (item.text === "Files") return currentPath === "/dashboard/files";
        if (item.text === "Panduan") return currentPath === "/dashboard/panduan";
        if (item.hasDropdown) {
            return item.subItems.some(subItem =>
                currentPath === `/dashboard/${subItem.toLowerCase().replace(' ', '')}`
            );
        }
        return false;
    };

    const getIsSubItemActive = (subItem) => {
        return currentPath === `/dashboard/${subItem.toLowerCase().replace(' ', '')}`;
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
            >
                {isOpen ? (
                    <HiX className="w-6 h-6 text-gray-600" />
                ) : (
                    <HiMenu className="w-6 h-6 text-gray-600" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out z-40
                ${isCollapsed && !isMobile ? 'w-20' : 'w-64'}
                ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
            `}>
                <div className="h-full bg-white shadow-lg relative">
                    {!isMobile && (
                        <button
                            onClick={handleCollapse}
                            className="absolute -right-3 top-8 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-50"
                        >
                            {isCollapsed ? (
                                <HiChevronRight className="w-4 h-4 text-gray-600" />
                            ) : (
                                <HiChevronLeft className="w-4 h-4 text-gray-600" />
                            )}
                        </button>
                    )}

                    <div className={`flex flex-col justify-center h-24 border-b ${isCollapsed && !isMobile ? 'px-2' : 'px-4 ml-3'}`}>
                        {(!isCollapsed || isMobile) ? (
                            <>
                                <span className="font-semibold text-gray-800 truncate">{userData?.name || 'Loading...'}</span>
                                <span className="text-sm text-gray-500 truncate">{userData?.office || 'Loading...'}</span>
                                <span className="text-xs text-gray-400 truncate">{userData?.department || 'Loading...'}</span>
                            </>
                        ) : (
                            <div className="w-10 h-10 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {userData?.name
                                        ? userData.name
                                            .split(' ')
                                            .map(word => word[0])
                                            .join('')
                                            .toUpperCase()
                                        : 'U'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Menu items remain the same... */}
                    <div className="py-4 px-3">
                        <ul className="space-y-2">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = getIsActive(item);

                                return (
                                    <li key={index}>
                                        <button
                                            className={`flex items-center w-full p-2 rounded-lg group ${isActive
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-blue-100 hover:text-blue-500"
                                                }`}
                                            onClick={() => handleMenuClick(item)}
                                        >
                                            <div className="flex items-center justify-center min-w-[24px]">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            {(!isCollapsed || isMobile) && (
                                                <div className="flex items-center justify-between w-full ml-3">
                                                    <span className="truncate">{item.text}</span>
                                                    {item.hasDropdown && (
                                                        <div className="ml-2">
                                                            {openDropdowns[item.text] ? (
                                                                <HiChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <HiChevronDown className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                        {item.hasDropdown && openDropdowns[item.text] && (!isCollapsed || isMobile) && (
                                            <ul className="mt-2 ml-4 space-y-1">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <button
                                                            className={`flex items-center w-full p-2 text-sm rounded-lg ${getIsSubItemActive(subItem)
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "text-gray-600 hover:bg-blue-100 hover:text-blue-500"
                                                                }`}
                                                            onClick={() => handleSubItemClick(subItem)}
                                                        >
                                                            <div className="w-6"></div>
                                                            <span className="ml-3">{subItem}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="absolute bottom-4 w-full px-3">
                        <button
                            className="flex items-center p-2 w-full text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-500 group"
                            onClick={handleSignOut}
                        >
                            <div className="flex items-center justify-center min-w-[24px]">
                                <HiArrowSmRight className="w-6 h-6" />
                            </div>
                            {(!isCollapsed || isMobile) && (
                                <span className="ml-3">Sign Out</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidebarComponent;