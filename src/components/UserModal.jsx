// UserModal.js
import { useState, useEffect, useRef, forwardRef } from 'react';
import { HiX, HiPencil, HiUser, HiMail, HiPhone, HiOfficeBuilding, HiUserGroup, HiKey } from 'react-icons/hi';

const INITIAL_FORM_STATE = {
    name: '',
    email: '',
    phone: '',
    office: '',
    department: '',
    password: '',
    role: 'user'
};

const FormField = ({ icon: Icon, label, children }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            {label}
        </label>
        {children}
    </div>
);

// Buat InputField sebagai forwardRef component
const InputField = forwardRef(function InputField({ type = "text", value, onChange, required = false }, ref) {
    return (
        <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 
                     bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all duration-200"
            required={required}
        />
    );
});

const UserModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isCreate = false
}) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [isEditing, setIsEditing] = useState(false);
    const modalRef = useRef(null);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (isCreate) {
                setFormData(INITIAL_FORM_STATE);
                setIsEditing(true);
            } else if (initialData) {
                setFormData(initialData);
                setIsEditing(false);
            }

            const focusTimer = setTimeout(() => {
                if (nameInputRef.current) {
                    nameInputRef.current.focus();
                }
            }, 0);

            return () => clearTimeout(focusTimer);
        }
    }, [isOpen, isCreate, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleClose = () => {
        setFormData(INITIAL_FORM_STATE);
        setIsEditing(false);
        onClose();
    };

    const ViewField = ({ label, value, icon: Icon, badge }) => (
        <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-gray-400" />
                {label}
            </label>
            {badge ? (
                <div className="mt-1">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${value === 'admin' ? 'bg-blue-100 text-blue-800' :
                        value === 'user' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {value}
                    </span>
                </div>
            ) : (
                <p className="text-gray-900 mt-1">{value || '-'}</p>
            )}
        </div>
    );

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60]"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 z-[-1]">
                <div className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
            </div>

            {/* Modal Container */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-xl w-full max-w-lg shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h3
                                    id="modal-title"
                                    className="text-xl font-semibold text-gray-900 flex items-center gap-2"
                                >
                                    <HiUser className="w-5 h-5 text-blue-500" />
                                    {isCreate ? 'Create New User' : isEditing ? 'Edit User' : 'User Details'}
                                </h3>
                                <div className="flex space-x-2">
                                    {!isCreate && !isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                            title="Edit"
                                        >
                                            <HiPencil className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        title="Close"
                                    >
                                        <HiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {(isCreate || isEditing) ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <FormField icon={HiUser} label="Name">
                                        <InputField
                                            ref={nameInputRef}
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </FormField>

                                    <FormField icon={HiMail} label="Email">
                                        <InputField
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </FormField>

                                    {isCreate && (
                                        <FormField icon={HiKey} label="Password">
                                            <InputField
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                required
                                            />
                                        </FormField>
                                    )}

                                    <FormField icon={HiPhone} label="Phone">
                                        <InputField
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </FormField>

                                    <FormField icon={HiOfficeBuilding} label="Divisi">
                                        <InputField
                                            value={formData.office}
                                            onChange={(e) => setFormData(prev => ({ ...prev, office: e.target.value }))}
                                        />
                                    </FormField>

                                    <FormField icon={HiOfficeBuilding} label="Grup">
                                        <InputField
                                            value={formData.department}
                                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                        />
                                    </FormField>

                                    <FormField icon={HiUserGroup} label="Role">
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 
                                                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                 focus:border-transparent transition-all duration-200"
                                            required
                                        >
                                            <option value="guest">Guest</option>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </FormField>

                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 
                                                 hover:bg-gray-50 border border-gray-300 transition-colors
                                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-white 
                                                 bg-blue-600 hover:bg-blue-700 transition-colors
                                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            {isCreate ? 'Create User' : 'Update User'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid gap-4">
                                    <ViewField label="Name" value={formData.name} icon={HiUser} />
                                    <ViewField label="Email" value={formData.email} icon={HiMail} />
                                    <ViewField label="Phone" value={formData.phone} icon={HiPhone} />
                                    <ViewField label="Divisi" value={formData.office} icon={HiOfficeBuilding} />
                                    <ViewField label="Grup" value={formData.department} icon={HiUserGroup} />
                                    <ViewField label="Role" value={formData.role} icon={HiUser} badge />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;