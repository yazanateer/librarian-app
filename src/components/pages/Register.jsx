import React, { useState } from "react";

export const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [role] = useState("ADMIN");
    
    const handleSubmit = async (e) => {
        e.preventDefault();

  
        const new_user = {
        username,
        email,
        role,
        avatar
       };


try{ 
    const response = await fetch("http://localhost:8084/superapp/users", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        }, body: JSON.stringify(new_user),
    });

    if(response.ok) { 
        console.log("User added to the database succesfully");
        alert("the user registed sucessfully");
    } else {
        console.error("error creating the user: ", response.statusText);
    }
} catch(error) {
    console.error("error creating the user ", error);
}
};
    
    
    
    
    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Role: </label>
                    <input
                        type="text"
                        value={role}
                        disabled
                        required
                    />
                </div>
                <div>
                    <label>Avatar: </label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
                <a href="/Login" className="login-link">Login</a>

            </form>
        </div>
    );
};
