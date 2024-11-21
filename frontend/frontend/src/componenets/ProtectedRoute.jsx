import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { authcheck } from "../store/authslice";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";


function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const {  loading } = useSelector((state) => state.auth); // Accessing state from Redux store
    const isAuthorized =localStorage.getItem("isAuthorized")==="true";
    console.log(isAuthorized)
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            console.log("admin",isAuthorized)

            
            if (token || refreshToken) {
                try {
                    await dispatch(authcheck()).unwrap();
                    console.log("admin",isAuthorized) 
                } catch (error) {
                    console.error('Error during auth check:', error);
                    
                }
            }
        };

        checkAuth();
    }, [dispatch]);

 
    if (loading) {
        
    }

    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    return children; 
}

export default ProtectedRoute;
