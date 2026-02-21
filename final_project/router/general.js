const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password)
        return res.status(404).json({ message: "Error logging in" });

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous fetch of the books object
        const getBooks = () => Promise.resolve(books);
        const bookList = await getBooks();

        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBookByIsbn = (id) => {
            return new Promise((resolve, reject) => {
                const book = books[id];
                if (book) resolve(book);
                else reject("Book not found");
            });
        };

        const req_book = await getBookByIsbn(isbn);
        return res.status(200).send(JSON.stringify(req_book, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = (auth) => {
            return new Promise((resolve) => {
                const filteredBooks = Object.values(books).filter(b => b.author === auth);
                resolve(filteredBooks);
            });
        };

        const results = await getBooksByAuthor(author);

        if (results.length > 0) {
            return res.status(200).send(JSON.stringify(results, null, 4));
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = (t) => {
            return new Promise((resolve) => {
                const filteredBooks = Object.values(books).filter(b => b.title === t);
                resolve(filteredBooks);
            });
        };

        const results = await getBooksByTitle(title);

        if (results.length > 0) {
            return res.status(200).send(JSON.stringify(results, null, 4));
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const req_book = books[req.params.isbn];
    if (req_book)
        return res.status(200).send(JSON.stringify(req_book.reviews));
    else
        return res.status(300).json({ message: "book not found" });
});

module.exports.general = public_users;
