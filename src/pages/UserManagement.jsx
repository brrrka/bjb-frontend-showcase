// UserManagement.js
import { useState, useEffect, useCallback } from 'react';
import { HiTrash, HiSearch, HiEye, HiPlus, HiExclamation, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SidebarComponent from '../components/SidebarComponent';
import UserModal from '../components/UserModal';
import { toast } from 'react-toastify';
import dummyApi from '../services/dummyApi';
import debounce from 'lodash/debounce';

const UserManagement = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedRole, setSelectedRole] = useState('all');
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        userName: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 5
    });

    const debouncedFetchUsers = useCallback(
        debounce((search, role, page) => {
            fetchUsers(search, role, page);
        }, 300),
        []
    );

    const roles = ['all', 'admin', 'user', 'guest'];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (search = searchTerm, role = selectedRole, page = 1) => {
        try {
            setLoading(true);
            const response = await dummyApi.get('/users', {
                params: {
                    search,
                    role,
                    page,
                }
            });

            setUsers(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        debouncedFetchUsers(searchTerm, selectedRole, pagination.currentPage);
    }, [searchTerm, selectedRole, pagination.currentPage]);

    const handleCreateUser = async (userData) => {
        try {
            const response = await dummyApi.post('/users', userData);
            setUsers([...users, response.data]);
            setIsModalOpen(false);
            toast.success('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await dummyApi.put(`/users/${selectedUser.id}`, userData);
            setUsers(users.map(user => user.id === selectedUser.id ? response.data : user));
            setIsModalOpen(false);
            toast.success('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteClick = (userId, userName) => {
        setDeleteModal({
            isOpen: true,
            userId,
            userName
        });
    };

    const handleDelete = async () => {
        try {
            await dummyApi.delete(`/users/${deleteModal.userId}`);
            setUsers(users.filter(user => user.id !== deleteModal.userId));
            toast.success('User deleted successfully');
            setDeleteModal({ isOpen: false, userId: null, userName: '' });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            const response = await dummyApi.get(`/users/${userId}`);
            setSelectedUser(response.data);
            setIsCreateMode(false);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to fetch user details');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setIsCreateMode(false);
    };

    const handleModalSubmit = (formData) => {
        if (isCreateMode) {
            handleCreateUser(formData);
        } else {
            handleUpdateUser(formData);
        }
    };

    const handleCreateClick = () => {
        setIsCreateMode(true);
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const PaginationControls = () => (
        <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="flex items-center">
                <span className="text-sm text-gray-700">
                    Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} entries
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-lg ${pagination.currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <HiChevronLeft className="w-5 h-5" />
                </button>
                {/* Page numbers */}
                {[...Array(pagination.lastPage)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                        pageNumber === 1 ||
                        pageNumber === pagination.lastPage ||
                        (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                    ) {
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-1 rounded-lg ${pageNumber === pagination.currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    }
                    if (
                        pageNumber === pagination.currentPage - 2 ||
                        pageNumber === pagination.currentPage + 2
                    ) {
                        return <span key={pageNumber}>...</span>;
                    }
                    return null;
                })}
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className={`p-2 rounded-lg ${pagination.currentPage === pagination.lastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <HiChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const TableSkeleton = () => (
        <>
            {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex space-x-3">
                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole === 'all' || user.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                activeItem="User Management"
            />

            <main className={`flex-1 overflow-x-hidden will-change-transform transform-gpu transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-xl shadow-sm">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-500">Manajemen User yang telah terdaftar</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="relative flex-1 min-w-0">
                                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Role Filter */}
                            <div className="w-full md:w-48">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Add User Button */}
                            <button
                                onClick={handleCreateClick}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center md:justify-start"
                            >
                                <HiPlus className="w-5 h-5 mr-2" />
                                Add User
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">Grup</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">Role</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <TableSkeleton />
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 md:px-6 py-8 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 md:px-6 py-3 md:py-4">
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">
                                                    <div className="truncate max-w-[150px] md:max-w-none">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600 hidden md:table-cell">{user.department}</td>
                                                <td className="px-4 md:px-6 py-3 md:py-4">
                                                    <span className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-full font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                        user.role === 'user' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4">
                                                    <div className="flex space-x-2 md:space-x-3">
                                                        <button
                                                            onClick={() => handleViewDetails(user.id)}
                                                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                        >
                                                            <HiEye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(user.id, user.name)}
                                                            className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <HiTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <PaginationControls />
                        </div>
                    </div>
                </div>

                <UserModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                    initialData={selectedUser}
                    isCreate={isCreateMode}
                />

                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="fixed inset-0 bg-black opacity-30"></div>

                        <div className="flex items-center justify-center min-h-screen">
                            <div className="relative bg-white w-full max-w-md p-6 mx-4 rounded-lg shadow-xl">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                                    <HiExclamation className="w-6 h-6 text-red-600" />
                                </div>

                                <h3 className="mt-3 text-lg font-medium text-center text-gray-900">
                                    Konfirmasi Hapus User
                                </h3>

                                <p className="mt-2 text-sm text-center text-gray-500">
                                    Apakah Anda yakin ingin menghapus user <span className="font-medium">{deleteModal.userName}</span>?
                                    <br />Aksi ini tidak dapat dibatalkan.
                                </p>

                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                                        onClick={handleDelete}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserManagement;