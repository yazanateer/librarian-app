import React from "react";
import { Link, Navigate } from "react-router-dom";
import "../pages/css_pages/librarian.css"

export const LibrarianDash = ({ user }) => {

    //check if the user isnt authenicated , redirect to the login 
    if (!user) {
        return <Navigate to="/Login" replace />;
        }
    return (
        <div className="home-container-libr">
            <div className="libr-section">
                <h1 className="header_libr">Welcome to the librarian dashboard</h1>
                <p className="para-do"> choose the service you want to do</p>
                <div className="libr-card-container">
                    
                    <Link to="/ManageBooks" className="libr-card">Mange the books</Link>
                    <Link to="/ManagePatrons" className="libr-card">Manage the patrons</Link>
                    <div className="libr-card">manage the fines</div>

                </div>
            </div>    
        </div>
    );
};