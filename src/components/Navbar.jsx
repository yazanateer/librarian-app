import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"
import userImg from "../img/user.png";  
export const Navbar = ({ user }) => {
    const [menuOpen, setMenuOpen] = useState(false);


    return (
        <nav>
            <Link to="/" className="title">CityLibrary</Link>
            {user ? (
                <div className="user_inform">
                <img src={userImg} alt="user img" className="userImg" />
                <span>&nbsp; Welcome {user.username}</span>
                </div>
            ) : (
                <span></span>
            )}
            <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
      </div>
            <ul className={menuOpen ? "open" : ""}>
                {!user && (
                    <li>
                        <Link to="/Login">Login</Link>
                    </li>
                )}
                

                <li>
                <Link to="/LibrarianDash">Librarian Dashboard</Link>
                </li>


            </ul>
        </nav>
    )

}
