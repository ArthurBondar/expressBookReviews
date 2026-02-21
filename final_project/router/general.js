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
