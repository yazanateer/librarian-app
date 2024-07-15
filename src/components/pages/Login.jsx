import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css_pages/log_reg.css";


export const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [superapp,setSuperapp] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:8084/superapp/users/login/${superapp}/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // if (data.role !== "ADMIN") {
            //     throw new Error('Access denied: User is not an ADMIN');
            // }
            alert('Login success');
            onLoginSuccess(data);
            navigate('/LibrarianDash');
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
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
                    <label>superapp: </label>
                    <input
                        type="text"
                        value={superapp}
                        onChange={(e) => setSuperapp(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <a href="/Register" className="login-link">Sign up</a>
            </form>
        </div>
    );
};
