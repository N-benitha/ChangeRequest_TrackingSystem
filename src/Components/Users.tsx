import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import './Users.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth');
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

    const handleUsername: HandleUsername = (id) => {
        navigate(`./user-info/?id=${id}`)
    }

    const handleRemove = async (id: string) => {
        try {
            await axios.delete(`http://localhost:3000/auth/${id}`);

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            
        } catch (error) {
            console.error("Failed to delete user", error);
            
        }
    }

    const handleAddUser = async () => {
        try {
            navigate('add-user');
        } catch (error) {
            console.error("Unable to navigate user", error);
            
        }
    }

  return (
    <div className="box-body">
        <div className="add-user">
            <button className='btn-add-user' onClick={handleAddUser}>Add User</button>
            <span className='user-count'>{users.length} Users</span>
        </div>
        <div className="content">
            {users.map((user, index) => (
                <div className="user" key={user.id}>
                    <div className="user-name" onClick={() => handleUsername(user.id)}>{user.username}</div>
                    <div className="user-type">
                        <span className="info">{user.user_type ||'No type yet.'}</span>
                        <div className="btns">
                            <select className='btn-type' defaultValue="">
                                <option value="" disabled hidden>Select user type</option>
                                <option value="developer">Developer</option>
                                <option value="approver">Approver</option>
                                <option value="admin">Admin</option>
                            </select>
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