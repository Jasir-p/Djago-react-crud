import React, { useEffect, useState } from 'react'
import api from '../../../api'
import { useDispatch, useSelector } from 'react-redux'
import "./adminlogin.css"
import { setUsername,setError } from '../../../store/authslice'
import { Adminauthsection } from '../../../service/service'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN } from '../../../constants'



const Adminlogin = () => {

    const [password, setPassword] = useState('')
    const [username,setUsername]=useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const username = useSelector((state) => state.auth.username)
    const error = useSelector((state) => state.auth.error)
    const{adminlogin}=Adminauthsection()
    const handleSubmit = async (e) => {
        e.preventDefault();
    
       
        
            try {
                
                await adminlogin("api/token/", username, password);
                
                
                const tok = localStorage.getItem(ACCESS_TOKEN);
                console.log('Token from localStorage:', tok);
               
                console.log("Sending request to:", `${api.defaults.baseURL}/check/`);
                const userRes = await api.get('/check/');
                console.log('User response:', userRes.data);
                const{isAdmin}=userRes.data
                console.log('User response:', isAdmin);
                if (isAdmin) {
                    
                    // localStorage.setItem('isAdmin', 'true');
                    navigate("/adminhome");
                    
                } else {
                    alert('You do not have admin access.');
                }
            } catch (error) {
                dispatch(setError('Invalid Credentials!'));
                console.error('Error during login:', error);
            }
        };
        
    
    return (
        <form className='admin-form-container' onSubmit={handleSubmit}>
            <h2 className='my-3'>Admin Login</h2>
            {error && (
                <div className="alert text-center py-2" role="alert">
                    {error}
                </div>
            )}
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    name="username"
                    className='admin-form-input my-2 p-2'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    name="password"
                    className='admin-form-input my-2 p-2'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className='admin-login-button my-4 p-2' type="submit">Login</button>
        </form>
    )
}

export default Adminlogin
