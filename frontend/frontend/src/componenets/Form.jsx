import { useState } from "react";
import "./Form.css"

import { useNavigate } from "react-router-dom";

import React from 'react';
import { authsection } from "../service/service";
import { useDispatch } from "react-redux";




const Form = ({ route, method }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const dispatch=useDispatch()


    const {registerorlogin}=authsection()

    
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
    console.log(method)
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        
        if (method !== 'Login' && !validateUsername(username)) {
            setUsernameError("Username should be alphanumeric and 3-20 characters long.");
            setLoading(false);
            return;
        } else {
            setUsernameError("");
        }

        if (method !== 'Login' && !validateEmail(email)) {
            setEmailError("Please enter a valid email.");
            setLoading(false);
            return;
        } else {
            setEmailError("");
        }

        if (method !== 'Login' && !validatePassword(password)) {
            setPasswordError("Password must include uppercase, lowercase, number, and special character.");
            setLoading(false);
            return;
        } else {
            setPasswordError("");
        }

        
        if (method === "Login") {
            console.log("working");
        
            try {
                const res = await registerorlogin(route, { username, password }, method);
                console.log("data", res);
        
                if (res.access) {
                    localStorage.setItem('isAuthorized', 'true');
                    // 
                                        navigate("/");
                } else {
                    
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error during login:", error);
                
            }
        } else {
            console.log(route);
        
            try {
                
                await registerorlogin(route, { username, password, email }, method);
               
                navigate("/login");
            } catch (error) {
                console.error("Error during registration:", error);
                
            }
        }
        
    };

    return (
        <>
            <form  className='form-container'onSubmit={handleSubmit}>
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
                {usernameError && <p cclassName="alert alert-danger text-center py-2" role="alert">{usernameError}</p>}

                {method !== 'Login' && (
                    <>
                        <input
                            type="email"
                            name="email"
                            className='form-input my-2 p-2'
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="error">{emailError}</p>}
                    </>
                )}

                <input
                    type="password"
                    name="password"
                    className='form-input my-2 p-2'
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p className="error">{passwordError}</p>}

                <button type="submit" className='form-button my-4 p-2' disabled={loading}>
                    {loading ? "Loading..." : method === "login" ? "Login" : "Sign Up"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}
        </>
    );
};

export default Form;
