import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import LoadingScreen from './LoadingRouteComponent';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();


    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
