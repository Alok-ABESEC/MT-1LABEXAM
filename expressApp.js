import express from "express";

const app = express();

app.use(express.json());

let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350,
        category: "Fiction"
    },
    {
        id: 2,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        price: 250,
        category: "Biography"
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 550,
        category: "Programming"
    }
];

// GET: Retrieve all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// GET: Retrieve a book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// POST: Add a new book
app.post("/books", (req, res) => {
    const { id, title, author, price, category } = req.body;

    if (
        id == null ||
        !title ||
        !author ||
        price == null ||
        !category
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (books.some(b => b.id === Number(id))) {
        return res.status(400).json({
            message: "Book ID already exists"
        });
    }

    const book = {
        id: Number(id),
        title,
        author,
        price: Number(price),
        category
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book: book
    });
});

// PUT: Update a book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price, category } = req.body;

    if (
        !title ||
        !author ||
        price == null ||
        !category
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    book.title = title;
    book.author = author;
    book.price = Number(price);
    book.category = category;

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});

// DELETE: Delete a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

// Start server
app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});