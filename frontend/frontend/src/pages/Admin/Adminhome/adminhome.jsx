import React, { useState, useEffect } from 'react';

import api from '../../../api'; // Make sure axiosInstance is defined here
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername,setError,clearAuth } from '../../../store/authslice'


const Adminhome = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', is_active: true });
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null); 
    const username = useSelector((state) => state.auth.username);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchUsers();

    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("admins/user_list/");
            res.data.sort((a,b)=>b.username.localeCompare(a.username))
            setUsers(res.data);
            console.log(res.data)
            
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users.');
            localStorage.clear()
            navigate("/admin") 
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            is_active: user.is_active
        });
    };

    const handleBlockUnblock = async (userId, isActive) => {
        try {
            await api.post(`/admins/user/block/${userId}/`, { is_active: !isActive });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            setError('Failed to update user status.'); 
        }
    };

  

    const handleSubmit = async (e) => {
        e.preventDefault();
       

        try {
            await api.post(`/admins/userEdit/${editingUser.id}/`, formData);

            
            setEditingUser(null);
            setFormData({ username: '', email: '', is_active: true });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user details:', error.response?.data || error.message);
            setError('Failed to update user details.'); 
        }
    };

    const handleLogout = async () => {
        try {
            const refresh_token = localStorage.getItem('REFRESH_TOKEN');
            // await api.post('/logout/', { refresh_token });
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN')
            localStorage.clear();
            dispatch(clearAuth());
            
            navigate('/admin');
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Failed to log out.');                                                  
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container min-vh-100 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}

            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by username or email"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="form-control w-50"
                />

                
                <button className="btn btn-primary" onClick={()=>navigate("/adduser")} >Add New User</button>
            </div>

           
            {editingUser && (
                <div className="card p-4 mb-4">
                    <h4 className="mb-3">Edit User</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-check mb-3">
                            <input
                                id="is_active"
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            <label htmlFor="is_active" className="form-check-label">Active</label>
                        </div>
                        <div className="d-flex">
                            <button type="submit" className="btn btn-success me-2">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* User List */}
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.is_active ? 'Active' : 'Blocked'}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(user)}>Edit</button>
                                {user.username !== username && (
                                    <button
                                        className={`btn btn-${user.is_active ? 'danger' : 'success'} btn-sm me-2`}
                                        onClick={() => handleBlockUnblock(user.id, user.is_active)}
                                    >
                                        {user.is_active ? 'Block' : 'Unblock'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Adminhome;
