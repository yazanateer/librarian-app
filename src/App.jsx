import React,{useState} from "react";
import { Navbar } from "./components/Navbar";
import { LibrarianDash } from "./components/pages/LibrarianDash";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { SearchBook } from "./components/pages/SearchBook";
import { ManageBooks } from "./components/pages/ManageBooks.jsx";
import { ManagePatrons } from "./components/pages/ManagePatrons.jsx";

import { Route,Routes } from "react-router-dom";
import { Home } from "./components/Home";


function App() {

  const [user, setUser] = useState(null);
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div>
    <Navbar user={user} />

    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path="/Login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/SearchBook" element={<SearchBook />} />
      <Route path="/ManageBooks" element={<ManageBooks user={user}/>} />
      <Route path="/ManagePatrons" element={<ManagePatrons user={user} />} />
      <Route path="/LibrarianDash" element={<LibrarianDash user={user}/>} />
    </Routes>
    </div>
  );
}

export default App;
