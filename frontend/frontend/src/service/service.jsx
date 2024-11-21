import { createSlice } from '@reduxjs/toolkit';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';
import { useState } from 'react';

export const authsection = () => {
    const registerorlogin = async (route, data, method) => {
        console.log(route);

        try {
            const res = await api.post(route, data);
            if (method === "Login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            }
            return res.data;
        } catch (error) {
            console.log(error);
            alert(error);
        }
    };

    return { registerorlogin };
};

export const Adminauthsection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Admin login function
    const adminlogin = async (route, username, password) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post(route, { username, password },);

            if (res.data.access && res.data.refresh) {
                console.log("hii")
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem('isAdmin', 'true');
            } else {
                throw new Error('Tokens not received.');
            }

            return res.data;
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { adminlogin, loading, error }; // Return the necessary states and function
};
