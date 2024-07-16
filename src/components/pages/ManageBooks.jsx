import React, { useState } from "react";
import "../pages/css_pages/ManageBooks.css";  
import axios from "axios";


export const ManageBooks = ({user}) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchRemoveInput, setSearchRemoveInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultss, setSearchResultss] = useState([]);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [showSearchFormm, setShowSearchFormm] = useState(false);
    const [userDetails] = useState({ superapp: "citylibrary", email: user ? user.userid.email: "" }); 
    const [booksList, setBooksList] = useState([]);
    const [displayTable, setDisplayTable] = useState(false);




    const truncate = (str, maxLength) => {
        return str.length > maxLength ? str.substring(0, maxLength) : str;
    };


    const handleAddBook = async (e) => {
        e.preventDefault();
        const books = await handleSearch(searchInput, "", ""); 
        setSearchResults(books);
    };
    const handleDelBook = async (e) => {
        e.preventDefault();
        await handleDelSearch(searchRemoveInput); 
        
    };





    const limit_description = (description) => {
        if (!description) {
            return "No description available.";
        }
        const words = description.split(" ");
        let result = [];
        if (words.length > 30) {
            for (let i = 0; i < 30; i++) {
                result.push(words[i]);
            }
        } else {
            result = [...words];
        }
        const final_result = result.join(" ") + "...";
        return final_result;
    };


        const handleSearch = async (title, author, genre, invokedBy) => {
        try {
            const response = await axios.post("http://localhost:8084/superapp/miniapp/librarian_miniapp", {
                command: "searchbooks",
                commandAttributes: {
                    title: title,
                    author: author,
                    genre: genre
                },
                invokedBy: {
                    email: `${invokedBy}`
                },
                targetObject: {
                    internalObjectId: " " 
                }
            });
    
            if (response.data) {
                console.log('Response Data:', response.data); // Debugging line
                const books = response.data.map((item) => ({
                    id: item.id,
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    categories: item.volumeInfo.categories,
                    description: limit_description(item.volumeInfo.description),
                    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
                    infoLink: item.volumeInfo.infoLink,
                }));
                return books;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching the books: ", error);
            return [];
        }
    };


    const handleDelSearch = async (title) => {
        try {
            const response = await axios.get(`http://localhost:8084/superapp/objects/search/byType/Book`, {
                params: {
                    title: title,
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
                    authors: item.objectDetails.authors,
                    categories: item.objectDetails.categories,
                    description: limit_description(item.objectDetails.description),
                    thumbnail: item.objectDetails.thumbnail,
                }));

                 // Filter the books based on the title
                const filteredBooks = books.filter(book =>
                    book.title.toLowerCase().includes(title.toLowerCase())
                );

                setSearchResultss(filteredBooks);

                
            } else {
                setSearchResultss([]);
            }
        } catch (error) {
            console.error("Error fetching the books from library:", error);
            setSearchResultss([]);
        }
    };

    const addBookToLibrary = async (book, invokedBy) => {
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
                    email: `${invokedBy}`,
                }
            },
            objectDetails: {
                title: book.title,
                // authors : book.authors,
                categories :   book.categories,
                // description : book.description,
                thumbnail: book.thumbnail,
            }
        };
    
        console.log("Sending payload:", JSON.stringify(objectBoundary, null, 2)); // Log payload
    
        try {
            const response = await axios.post("http://localhost:8084/superapp/miniapp/librarian_miniapp", {
                command: "addbook",
                commandAttributes: objectBoundary,
                invokedBy: {
                    email: `${invokedBy}`
                },
                targetObject: {
                    internalObjectId: " " 
                }
            });
            console.log("Book Added to the library successfully:", response.data);
            alert("Book Added to the library successfully");
        } catch (error) {
            console.log("the invoked is",invokedBy);
            console.error("Error Adding the book:", error);
        }
    };

    const handleDeleteBook = async (book) => {
        try {
            const response = await axios.post("http://localhost:8084/superapp/miniapp/librarian_miniapp", {
                command: "removebook",
                commandAttributes: {
                    title: book.title
                },
                invokedBy: {
                    email: userDetails.email
                },
                targetObject: {
                    internalObjectId: book.id
                }
            });

            if (response.data) {
                console.log("Book Removed successfully:", response.data);
            }
        } catch (error) {
            console.error("Error removing the book:", error);
        }
    };

const fetchBooksByType = async (type) => {
    try {
        const response = await axios.get(`http://localhost:8084/superapp/objects/search/byType/${type}`, {
            params: {
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
                thumbnail: item.objectDetails.thumbnail,
                time: item.creationTimestamp,
                status: item.type === "Book" ? "Available" : (item.type === "Borrowed_Book" ? "Borrowed" : "Deleted"),
            }));
            return books;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error fetching the books of type ${type}:`, error);
        return [];
    }
};

const trackBookStatus = async () => {
    try {
        const bookTypes = ["Book", "Borrowed_Book", "removed_book"];
        let allBooks = [];
        for (const type of bookTypes) {
            const books = await fetchBooksByType(type);
            allBooks = [...allBooks, ...books];
        }

        allBooks.sort((a, b) => {
            if (a.time < b.time) return 1;
            if (a.time > b.time) return -1;
            return 0;
        });
        setBooksList(allBooks);
        if(displayTable === true){
        setDisplayTable(false);
    } else{
        setDisplayTable(true);
    }
    } catch (error) {
        console.error("Error fetching the books:", error);
        setBooksList([]);
        setDisplayTable(false);
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
                                            <button onClick={() => addBookToLibrary(book,userDetails.email)}>Add Book</button>
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
                    <button className="manage_btn" onClick={() => setShowSearchFormm(!showSearchFormm)}>Remove Book</button>
                    {showSearchFormm && (
                        <div>
                            <form onSubmit={handleDelBook}>
                                <input
                                    type="text"
                                    value={searchRemoveInput}
                                    onChange={(e) => setSearchRemoveInput(e.target.value)}
                                    placeholder="Enter book title"
                                />
                                <button type="submit" className="manage_btn">Search</button>
                            </form>
                            <div className="results-container">
                                {searchResultss.length > 0 ? (
                                    searchResultss.map((book) => (
                                        <div key={book.id} className="book-item">
                                            {book.thumbnail && <img src={book.thumbnail} alt={`${book.title} thumbnail`} />}
                                            <h2>{book.title}</h2>
                                            <p>{book.authors && book.authors.join(", ")}</p>
                                            <p>{book.categories && book.categories.join(", ")}</p>
                                            <p>{book.description}</p>
                                            <button onClick={() => handleDeleteBook(book)}>Remove Book</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No results found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            {/* Track Status Section */}
            <div className="manage-books-section">
                    <h3>Track Status of Books</h3>
                    <button className="manage_btn" onClick={trackBookStatus}>Track Status</button>
                     {/* Display table of books  */}
                     {displayTable && (
                        <table className="books-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {booksList.map((book) => (
                                    <tr key={book.id}>
                                        <td className={book.status === "Borrowed" ? "status-borrow" : (book.status === "Deleted" ? "status-delete" : "status-av")}>{book.id}</td>
                                        <td className={book.status === "Borrowed" ? "status-borrow" : (book.status === "Deleted" ? "status-delete" : "status-av")}>{book.title}</td>
                                        <td className={book.status === "Borrowed" ? "status-borrow" : (book.status === "Deleted" ? "status-delete" : "status-av")}>{book.time}</td>
                                        <td className={book.status === "Borrowed" ? "status-borrow" : (book.status === "Deleted" ? "status-delete" : "status-av")}>{book.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};



