const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password)
        return res.status(404).json({ message: "Error logging in" });

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const req_book = books[req.params.isbn];
    if (req_book)
        return res.status(200).send(JSON.stringify(req_book));
    else
        return res.status(300).json({ message: "book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    for (let id in books) {
        if (books[id].author == req.params.author)
            return res.status(200).send(JSON.stringify(books[id]));
    }
    return res.status(300).json({ message: "book not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    for (let id in books) {
        if (books[id].title == req.params.title)
            return res.status(200).send(JSON.stringify(books[id]));
    }
    return res.status(300).json({ message: "book not found" });
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
