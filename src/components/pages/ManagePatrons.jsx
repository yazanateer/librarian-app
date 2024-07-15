import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css_pages/ManagePatrons.css";
import { FaTrash, FaEdit } from "react-icons/fa";

export const ManagePatrons = ({ user }) => {
const [patronsList, setPatronsList] = useState([]);
const [userDetails] = useState({ superapp: "citylibrary", email: user ? user.userid.email: "" }); 

useEffect(() => {
fetchPatrons();
}, []);

const fetchPatrons = async () => {
try {
    const response = await axios.get("http://localhost:8084/superapp/admin/users", {
    params: {
        userSuperapp: "citylibrary",
        userEmail: userDetails.email,
        size: 10,
        page: 0,
    },

    });
    if (response.data) {
    setPatronsList(response.data);
    console.log(response.data);
    } else {
    setPatronsList([]);
    }
} catch (error) {
    console.error("Error fetching patrons:", error);
}
};

const handleDelete = async (userId) => {
try {
    const response = await axios.delete(`http://localhost:8084/superapp/admin/users/${userId}`, {
    params: {
        userSuperapp: "citylibrary",
        userEmail: user ? user.userid.email : "",
    },
    });
    if (response.status === 200) {
    console.log("User deleted successfully.");
    fetchPatrons(); // Refresh patrons list after deletion
    }
} catch (error) {
    console.error("Error deleting user:", error);
}
};

const handleEdit = (userId) => {
console.log("Edit user with ID:", userId);
// Implement edit functionality as needed
};

const handlePayFine = async (userId) => {
try {
    // Example logic for paying fine (assuming endpoint structure)
    const response = await axios.post(`http://localhost:8084/superapp/admin/users/${userId}/payfine`, {
    userSuperapp: "citylibrary",
    userEmail: user ? user.userid.email : "",
    });
    if (response.data) {
    console.log("Fine paid successfully:", response.data);
    
    fetchPatrons(); 
    }
} catch (error) {
    console.error("Error paying fine:", error);
}
};

return (
<div className="manage-patrons-container">
    <h1>Manage Patrons</h1>
    <table className="patrons-table">
    <thead>
        <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {patronsList.map((user) => (
        <tr key={user.userid.internalObjectId}>
            <td>{user.username}</td>
            <td>{user.userid.email}</td>
            <td>{user.role}</td>
            <td  className="action-buttons">
            <button className="action-button" onClick={() => handleEdit(user.userid)}>
                <FaEdit />
            </button>
            <button className="action-button" style={{ backgroundColor: "red" }} onClick={() => handleDelete(user.userid)}>
                <FaTrash />
            </button>
            <button className="action-button" onClick={() => handlePayFine(user.userid)}>
                Pay Fine
            </button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
</div>
);
};