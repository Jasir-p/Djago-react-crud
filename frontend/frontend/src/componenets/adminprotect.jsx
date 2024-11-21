import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authcheck } from "../store/authslice";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";

function AdminProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const { loading, isAuthorized } = useSelector((state) => state.auth);
    const isAdmin=localStorage.getItem("isAdmin")==="true";
    console.log("adminss",isAdmin)
    

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            console.log("admin",isAdmin)

            // Check if tokens exist before dispatching authcheck
            if (token || refreshToken) {
                try {
                    await dispatch(authcheck()).unwrap();
                    console.log("admin",isAdmin) // Use unwrap to handle fulfilled/rejected
                } catch (error) {
                    console.error('Error during auth check:', error);
                    // Handle auth check failure if necessary
                }
            }
        };

        checkAuth();
    }, [dispatch]);

    // Show a loading indicator while checking authentication
    if (loading) {
        return <div>Loading...</div>; // Placeholder loading component
    }

    

    if (!isAdmin) {
        return <Navigate to="/admin" />;
    }

    // Render children if everything checks out
    return children;
}

export default AdminProtectedRoute;
