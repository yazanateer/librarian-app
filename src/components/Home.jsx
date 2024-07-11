import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export const Home = () => {
    return (
        <div className="home-container">
            <div className="home-section">
                <div className="centered-rectangle">
                    <h1>Librarian dashboard</h1>
                    <p className="dashboard-description">
                        The Librarian dashboard allows librarians to manage the library's collection, track book statuses, and manage patrons' details and permissions.
                    </p>
                    <Link to="/LibrarianDash" className="dashboard-button">Go to Librarian Dashboard</Link>

                </div>
            </div>
        </div>
    );
};
