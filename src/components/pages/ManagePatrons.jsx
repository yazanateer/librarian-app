import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css_pages/ManagePatrons.css";
import { FaTrash, FaEdit } from "react-icons/fa";

export const ManagePatrons = ({ user }) => {
const [patronsList, setPatronsList] = useState([]);
const [userDetails] = useState({
superapp: "citylibrary",
email: user ? user.userid.email : "",
});
const [editData, setEditData] = useState({
email: "",
userId: "",
role: "",
username: "",
avatar: "",
});
const [editModeUserId, setEditModeUserId] = useState(null); // Track which user's edit form is open

useEffect(() => {
fetchPatrons();
}, []);

const fetchPatrons = async () => {
try {
    const response = await axios.get(
    "http://localhost:8084/superapp/admin/users",
    {
        params: {
        userSuperapp: "citylibrary",
        userEmail: userDetails.email,
        size: 10,
        page: 0,
        },
    }
    );
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

const handleEdit = async (editData) => {
try {
    const response = await axios.put(
    `http://localhost:8084/superapp/users/citylibrary/${editData.email}`,
    {
        // Assuming your API expects these fields to be updated
        role: editData.role,
        username: editData.username,
        avatar: editData.avatar,
    }
    );
    // Optionally handle success response (e.g., show a success message)
    console.log("Edit successful:", response.data);
    // Assuming you want to refresh the patrons list after update
    fetchPatrons();
} catch (error) {
    console.error("Error updating patron:", error);
    // Optionally handle error (e.g., show an error message)
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
            <td className="action-buttons">
            <button
                className="action-button"
                onClick={() => {
                // Set edit mode for this user
                setEditModeUserId(user.userId);
                setEditData({
                    email: user.userid.email,
                    userId: user.userId,
                    role: user.role,
                    username: user.username,
                    avatar: user.avatar,
                });
                }}
            >
                <FaEdit />
            </button>

            </td>
        </tr>
        ))}
    </tbody>
    </table>

    {/* Edit form/modal */}
    {editModeUserId !== null && (
    <div>
        <h2>Edit Patron</h2>
        <form>
        <br />
        <label>Email:</label>
        <input
            type="text"
            value={editData.email}
            readOnly  
            className="readonly-field"
        />
        <br />
        <label>Role:</label>
        <input
            type="text"
            value={editData.role}
            onChange={(e) =>
            setEditData({ ...editData, role: e.target.value })
            }
        />
        <br />
        <label>Username:</label>
        <input
            type="text"
            value={editData.username}
            onChange={(e) =>
            setEditData({ ...editData, username: e.target.value })
            }
        />
        <br />
        <label>Avatar:</label>
        <input
            type="text"
            value={editData.avatar}
            onChange={(e) =>
            setEditData({ ...editData, avatar: e.target.value })
            }
        />
        <br />
        <button
            type="button"
            onClick={() => {
            handleEdit(editData); // Call handleEdit with editData
            }}
        >
            Update Patron
        </button>
        </form>
    </div>
    )}
</div>
);
};
