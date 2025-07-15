import React, { useEffect, useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import './css/Users.css'
import { useNavigate } from 'react-router-dom'
import api from '../../../api/axios'

/**
 * Users component displays a list of users fetched from the backend API.
 * 
 * - Fetches users on mount and displays them with their username and user type.
 * - Allows navigation to user details and to the add user page.
 * - Supports removing a user from the list.
 * 
 * @component
 * @returns The rendered Users component.
 *
 */
const Users = () => {
    interface User {
        id: string;
        username: string;
        user_type?: string;
    }
    interface HandleUsername {
        (id: string): void;
    }

    const [users, setUsers] = useState<User[]>([]);
    const[loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data.users);

            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>

    // Navigate to individual user details page
    const handleUsername: HandleUsername = (id) => {
        navigate(`./user-info/?id=${id}`)
    }

    // Remove user from system and update local state
    const handleRemove = async (id: string) => {
        try {
            await api.delete(`/users/${id}`);
            // Update local state to remove deleted user without refetching
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            
        } catch (error) {
            console.error("Failed to delete user", error);   
        }
    }

    // Navigate to add user page
    const handleAddUser = async () => {
        navigate('add-user');
    }

  return (
    <div className="box-body">
        <div className="add-user">
            <button className='btn-add-user' onClick={handleAddUser}>Add User</button>
            <span className='user-count'>{users.length} Users</span>
        </div>
        <div className="content">
            {users.map((user, index) => (
                <div className="user" key={user.id || index}>
                    <div className="user-name" onClick={() => handleUsername(user.id)}>{user.username}</div>
                    <div className="user-type">
                        <span className="info">{user.user_type ||'No type yet.'}</span>
                        <div className="btns">
                            {/* <select className='btn-type' defaultValue="">
                                <option value="" disabled hidden>Select user type</option>
                                <option value="developer">Developer</option>
                                <option value="approver">Approver</option>
                                <option value="admin">Admin</option>
                            </select> */}
                            <button className='btn-remove' onClick={() => handleRemove(user.id)}>Remove</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
    </div>
    
  )
}

export default Users