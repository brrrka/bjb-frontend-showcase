import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import LoadingScreen from './LoadingRouteComponent';

function GuestRoute({ children }) {
    const { user } = useAuth();


    return user ? <Navigate to="/dashboard" /> : children;
}

export default GuestRoute;
