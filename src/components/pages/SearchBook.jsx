import React, { useState } from "react";
import "./css_pages/Search.css";
import axios from "axios";

export const limit_description = (description) => {
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

export const handleSearch = async (title, author, genre) => {
    try {
        const response = await axios.post("http://localhost:8084/superapp/miniapp/Patron_miniapp", {
            command: "searchBooks",
            commandAttributes: {
                title: title,
                author: author,
                genre: genre
            },
            invokedBy: {
                email: "yazan@gmail.com" 
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

export const SearchBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const books = await handleSearch(title, author, genre);
            setResults(books);
        } catch (err) {
            setError("Error fetching the books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-book-container">
            <h1>Search for a Book</h1>
            <form className="search-form" onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Author:</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div>
                    <label>Genre:</label>
                    <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
                </div>
                <button type="submit" disabled={loading}>Search</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="results-container">
                {results.length > 0 ? (
                    results.map((book) => (
                        <a key={book.id} href={book.infoLink} target="_blank" rel="noopener noreferrer" className="book-item">
                            {book.thumbnail && <img src={book.thumbnail} alt={`${book.title} thumbnail`} />}
                            <h2>{book.title}</h2>
                            <p>{book.authors && book.authors.join(", ")}</p>
                            <p>{book.categories && book.categories.join(", ")}</p>
                            <p>{book.description}</p>
                        </a>
                    ))
                ) : (
                    !loading && <p>No results found.</p>
                )}
            </div>
        </div>
    );
};