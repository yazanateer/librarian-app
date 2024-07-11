import React, { useState } from "react";
import "../pages/css_pages/ManageBooks.css";  
import { handleSearch } from "./SearchBook";
import axios from "axios";


export const ManageBooks = ({user}) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [userDetails] = useState({ superapp: "citylibrary", email: user ? user.userid.email: "" }); 
    const [booksList, setBooksList] = useState([]);



    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.substring(0, maxLength) : str;
    };


    const handleAddBook = async (e) => {
        e.preventDefault();
        const books = await handleSearch(searchInput, "", ""); 
        setSearchResults(books);
    };






    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8084/superapp/objects/search/byType/Book`, {
                params: {
                    
                    // title: title,
                    userSuperapp: userDetails.superapp,
                    userEmail: userDetails.email,
                    size: 20,
                    page: 0
                },
            });
            if (response.data) {
                const books = response.data.map((item) => ({
                    id: item.objectId.internalObjectId,
                    title: item.alias,
                    // authors: item.objectDetails.authors,
                    // categories: item.objectDetails.categories,
                    // description: limit_description(item.objectDetails.description),
                    // thumbnail: item.objectDetails.thumbnail,
                }));



                 // Filter the books based on the title
                const filteredBooks = books.filter(book =>
                    book.title.toLowerCase().includes(title.toLowerCase())
                );

                setResults(filteredBooks);

                // setResults(books);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Error fetching the books from library:", error);
            setResults([]);
        }
    };









    const addBookToLibrary = async (book) => {
        const objectBoundary = {
            objectId: { superapp: "citylibrary", internalObjectId: book.id },
            type: "Book",
            alias: truncate(book.title, 100),
            location: { lat: 0, lng: 0 },
            active: true,
            creationTimestamp: new Date().toISOString(),
            createdBy: {
                userId: {
                    superapp: userDetails.superapp,
                    email: userDetails.email,
                }
            },
            objectDetails: {
                // authors : book.authors,
                categories :   book.categories,
                // description : book.description,
                thumbnail: book.thumbnail,
            }
        };

        console.log("Sending payload:", JSON.stringify(objectBoundary, null, 2)); // Log payload

        try {
            const response = await axios.post("http://localhost:8084/superapp/objects", objectBoundary, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Book Added to the library successfully:", response.data);
        } catch (error) {
            console.error("Error Adding the book:", error);
        }

    }
    

    const handleDeleteBook = async (bookId) => {
    };

    const trackBookStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8084/superapp/books");
            console.log("Books fetched successfully:", response.data);
            setBooksList(response.data); // Assuming response.data is an array of books
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    return (
        <div>
            <h2>Manage Books</h2>
            <div className="manage-books-container">
                {/* Add Books Section */}
                <div className="manage-books-section">
                    <h3>Add Books to the Library</h3>
                    <button className="manage_btn" onClick={() => setShowSearchForm(!showSearchForm)}>Add Book</button>
                    {showSearchForm && (
                        <div>
                            <form onSubmit={handleAddBook}>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Enter book title"
                                />
                                <button type="submit" className="manage_btn">Search</button>
                            </form>
                            <div className="results-container">
                                {searchResults.length > 0 ? (
                                    searchResults.map((book) => (
                                        <div key={book.id} className="book-item">
                                            {book.thumbnail && <img src={book.thumbnail} alt={`${book.title} thumbnail`} />}
                                            <h2>{book.title}</h2>
                                            <p>{book.authors && book.authors.join(", ")}</p>
                                            <p>{book.categories && book.categories.join(", ")}</p>
                                            <p>{book.description}</p>
                                            <button onClick={() => addBookToLibrary(book)}>Add Book</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No results found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            


            {/* Remove Books Section */}
            <div className="manage-books-section">
                <h3>Remove Books from the Library</h3>
                <button className="manage_btn" onClick={handleDeleteBook}>Remove Book</button>
                {/* Add form or content for removing books */}
            </div>

            {/* Track Status Section */}
            <div className="manage-books-section">
                    <h3>Track Status of Books</h3>
                    <button className="manage_btn" onClick={trackBookStatus}>Track Status</button>
                    {/* Display table of books */}
                    <table className="books-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booksList.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.id}</td>
                                    <td>{book.status}</td> {/* Assuming status property exists */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
        </div>
    );
};



