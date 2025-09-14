// Dummy API service to simulate backend responses
import {
    dummyMainData,
    dummyQRISMerchantData,
    dummyUsers,
    dummyUpdateHistory,
    dummyUserProfile,
    dummyFeeBasedData,
    dummyFiles,
    dummyLoginCredentials
} from '../data/dummyData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class DummyApiService {
    // Auth endpoints
    async login(credentials) {
        await delay();

        if (credentials.email === dummyLoginCredentials.email &&
            credentials.password === dummyLoginCredentials.password) {

            localStorage.setItem('auth_token', 'dummy-token-12345');
            return {
                data: {
                    data: {
                        token: 'dummy-token-12345',
                        user: dummyUserProfile
                    }
                }
            };
        } else {
            throw new Error('Invalid credentials');
        }
    }

    async register(userData) {
        await delay();
        return {
            data: {
                message: 'User registered successfully',
                user: {
                    id: Date.now(),
                    ...userData
                }
            }
        };
    }

    async logout() {
        await delay();
        localStorage.removeItem('auth_token');
        return { data: { message: 'Logged out successfully' } };
    }

    async getUser() {
        await delay();
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('No token found');
        }
        return { data: dummyUserProfile };
    }

    // Data endpoints
    async getExcelData(type) {
        await delay();

        switch (type) {
            case 'main':
                return { data: dummyMainData };
            case 'qris_merchant':
                return { data: dummyQRISMerchantData };
            default:
                throw new Error('Unknown data type');
        }
    }

    async getUpdateHistory() {
        await delay();
        return { data: dummyUpdateHistory };
    }

    async getUsers(params = {}) {
        await delay();
        const { search = '', role = 'all', page = 1 } = params;

        let filteredUsers = dummyUsers.data;

        // Apply search filter
        if (search) {
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.department.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply role filter
        if (role !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }

        // Apply pagination
        const perPage = 5;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
            data: {
                data: paginatedUsers,
                current_page: parseInt(page),
                last_page: Math.ceil(filteredUsers.length / perPage),
                per_page: perPage,
                total: filteredUsers.length
            }
        };
    }

    async getUserById(userId) {
        await delay();
        const user = dummyUsers.data.find(u => u.id === userId);
        if (!user) {
            throw new Error('User not found');
        }
        return { data: user };
    }

    async createUser(userData) {
        await delay();
        const newUser = {
            id: Date.now(),
            ...userData,
            status: 'active',
            created_at: new Date().toISOString()
        };
        return { data: newUser };
    }

    async updateUser(userId, userData) {
        await delay();
        const updatedUser = {
            id: userId,
            ...userData,
            updated_at: new Date().toISOString()
        };
        return { data: updatedUser };
    }

    async deleteUser(userId) {
        await delay();
        return { data: { message: `User ${userId} deleted successfully` } };
    }

    async getFeeBasedData() {
        await delay();
        return { data: dummyFeeBasedData };
    }

    async getFiles(content = 'main') {
        await delay();
        return { data: dummyFiles[content] || dummyFiles.main };
    }

    async uploadFile(fileData) {
        await delay();
        const newFile = {
            id: Date.now(),
            ...fileData,
            uploaded_at: new Date().toISOString(),
            status: 'processed'
        };
        return { data: newFile };
    }

    // Generic request method to maintain compatibility
    async get(endpoint, config = {}) {
        const { params } = config;

        // Handle files with content parameter
        if (endpoint.startsWith('/files/content/')) {
            const content = endpoint.split('/files/content/')[1];
            return this.getFiles(content, params);
        }

        // Handle user by ID
        const userIdMatch = endpoint.match(/^\/users\/(\d+)$/);
        if (userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            return this.getUserById(userId);
        }

        const routes = {
            '/user': () => this.getUser(),
            '/excel-data/main': () => this.getExcelData('main'),
            '/excel-data/qris_merchant': () => this.getExcelData('qris_merchant'),
            '/files/recent': () => this.getUpdateHistory(),
            '/users': () => this.getUsers(params),
            '/files': () => this.getFiles(),
            '/fee-based': () => this.getFeeBasedData()
        };

        const handler = routes[endpoint];
        if (handler) {
            return handler();
        } else {
            throw new Error(`Endpoint ${endpoint} not found`);
        }
    }

    async activateFile(fileId) {
        await delay();
        return { data: { message: `File ${fileId} activated successfully` } };
    }

    async deleteFile(fileId) {
        await delay();
        return { data: { message: `File ${fileId} deleted successfully` } };
    }

    async post(endpoint, data) {
        // Handle file activation
        if (endpoint.match(/\/files\/\d+\/activate/)) {
            const fileId = parseInt(endpoint.split('/')[2]);
            return this.activateFile(fileId);
        }

        // Handle file upload
        if (endpoint === '/upload') {
            return this.uploadFile(data);
        }

        const routes = {
            '/login': () => this.login(data),
            '/register': () => this.register(data),
            '/logout': () => this.logout(),
            '/users': () => this.createUser(data),
            '/files/upload': () => this.uploadFile(data)
        };

        const handler = routes[endpoint];
        if (handler) {
            return handler();
        } else {
            throw new Error(`Endpoint ${endpoint} not found`);
        }
    }

    async updateProfile(userData) {
        await delay();
        const updatedProfile = {
            ...dummyUserProfile,
            ...userData,
            updated_at: new Date().toISOString()
        };
        return { data: updatedProfile };
    }

    async put(endpoint, data) {
        const userIdMatch = endpoint.match(/\/users\/(\d+)/);
        if (userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            return this.updateUser(userId, data);
        }

        if (endpoint === '/user/update') {
            return this.updateProfile(data);
        }

        throw new Error(`Endpoint ${endpoint} not found`);
    }

    async delete(endpoint) {
        const userIdMatch = endpoint.match(/\/users\/(\d+)/);
        if (userIdMatch) {
            const userId = parseInt(userIdMatch[1]);
            return this.deleteUser(userId);
        }

        const fileIdMatch = endpoint.match(/\/files\/(\d+)/);
        if (fileIdMatch) {
            const fileId = parseInt(fileIdMatch[1]);
            return this.deleteFile(fileId);
        }

        throw new Error(`Endpoint ${endpoint} not found`);
    }
}

// Create interceptors to maintain compatibility with axios
const dummyApi = new DummyApiService();

// Add request interceptor compatibility
dummyApi.interceptors = {
    request: {
        use: () => {
            // For compatibility, but not needed for dummy implementation
        }
    }
};

export default dummyApi;