import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css_pages/ManagePatrons.css"; // Create and import your CSS file for styling
import { FaTrash, FaEdit } from "react-icons/fa"; // import icons from react-icons

export const ManagePatrons = () => {
    const [users, setUsers] = useState([]);
   
    useEffect(() => {
        // Fetch users from the API
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8084/superapp/admin/users', {
                    params: {
                        userSuperapp: 'citylibrary',
                        userEmail: 'yazan@gmail.com',
                        size: 10,
                        page: 0
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
            console.log("Delete user with ID:", userId);
    };

    const handleEdit = (userId) => {
         console.log("Edit user with ID:", userId);
    };

    return (
        <div className="manage-patrons-container">
            <h1>Manage the users</h1>
            <table className="users-table">
                <thead>
                    <tr>
                        
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Avatar</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userid.internalObjectId}>
                            <td>{user.username}</td>
                            <td>{user.userid.email}</td>
                            <td>{user.role}</td>
                            {/* <td><img src={user.avatar} alt={`${user.username}'s avatar`} /></td> */}
                            <td>{user.avatar}</td>
                            <td>
                                <button className="action-button" onClick={() => {handleEdit(user.userid)}}>
                                    <FaEdit />
                                </button>
                                
                                <button className="action-button" style={{ backgroundColor:'red' }} onClick={() => {handleDelete(user.userid)}}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
