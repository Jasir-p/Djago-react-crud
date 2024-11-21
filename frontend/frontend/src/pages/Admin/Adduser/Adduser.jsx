import { useState } from "react";
import "./Adduser.css";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import React from 'react';

const Adduser = ({ route, method }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const navigate = useNavigate();

    // Email, Password and Username Validation Functions
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");  // Reset error
        setLoading(true);  // Start loading state

        // Validate Username
        if (!validateUsername(username)) {
            setUsernameError("Username should be alphanumeric and 3-20 characters long.");
            setLoading(false); // Stop loading if validation fails
            return;
        } else {
            setUsernameError("");  // Clear error if valid
        }

        // Validate Email
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email.");
            setLoading(false); // Stop loading if validation fails
            return;
        } else {
            setEmailError("");  // Clear error if valid
        }

        // Validate Password
        if (!validatePassword(password)) {
            setPasswordError("Password must include uppercase, lowercase, number, and special character.");
            setLoading(false); // Stop loading if validation fails
            return;
        } else {
            setPasswordError("");  
        }

       
        const newUser = { username, email, password };

        try {
            
            const res = await api.post('/api/user/register/', newUser);
            
                navigate('/adminhome'); 
           
        } catch (error) {
            
            setError("An error occurred during registration.");
            console.error("Error during registration:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            <form className='form-container' onSubmit={handleSubmit}>
                <input
                    type="text"
                    className='form-input my-2 p-2'
                    autoComplete="username"
                    id="username"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && <p className="alert alert-danger text-center py-2" role="alert">{usernameError}</p>}

                <input
                    type="email"
                    name="email"
                    className='form-input my-2 p-2'
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="alert alert-danger text-center py-2">{emailError}</p>}

                <input
                    type="password"
                    name="password"
                    className='form-input my-2 p-2'
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p className="alert alert-danger text-center py-2">{passwordError}</p>}

                <button type="submit" className='form-button my-4 p-2' disabled={loading}>
                    {loading ? "Loading..." : "Sign Up"}
                </button>
            </form>

            {error && <p className="alert alert-danger text-center py-2">{error}</p>}
        </>
    );
};

export default Adduser;
