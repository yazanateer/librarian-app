import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css_pages/ManagePatrons.css";
import { FaTrash, FaEdit } from "react-icons/fa";

export const ManagePatrons = ({ user }) => {
const [patronsList, setPatronsList] = useState([]);
const [userDetails] = useState({ superapp: "citylibrary", email: user ? user.userid.email: "" }); 
const [editData, setEditData] = useState({
    userId: '',
    role: '',
    username: '',
    avatar: ''
  });
  const [editModeUserId, setEditModeUserId] = useState(null); // Track which user's edit form is open



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



const handleEdit = async  (userId, role, username, avatar) => {
    const email = userDetails.email;
    try{
        const response = await axios.put(`http://localhost:8084/superapp/users/citylibrary/${email}`)


    
    }catch(error) {

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
        <button className="action-button" onClick={() => {}}>
            <FaEdit />
        </button>
        <button className="action-button" style={{ backgroundColor: "red" }} onClick={ () => {}}>
            <FaTrash />
        </button>
    
        </td>
    </tr>
    ))}
</tbody>
</table>

    {/* Your edit form/modal */}
    {/* Example: */}
    <div>
    <h2>Edit Patron</h2>
    <form>
        <label>User ID: {editData.userId}</label><br />
        <label>Email:</label>
        <input type="text" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} /><br />
        <label>Role:</label>
        <input type="text" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} /><br />
        <label>Username:</label>
        <input type="text" value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} /><br />
        <label>Avatar:</label>
        <input type="text" value={editData.avatar} onChange={(e) => setEditData({ ...editData, avatar: e.target.value })} /><br />
        <button type="button" onClick={() => {}}>Update Patron</button>
    </form>
    </div>
</div>
);
};