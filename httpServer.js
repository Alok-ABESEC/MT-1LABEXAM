import http from "http";
import fs from "fs";

let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350
    }
];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");

    // Route 1: Welcome page
    if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Library Management</h1>");
    }

    // Route 2: Get all books
    else if (req.method === "GET" && url.pathname === "/books") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(books));
    }

    // Route 3: About page
    else if (req.method === "GET" && url.pathname === "/about") {
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });

        res.end("Library Book Management Application");
    }

    // Route 4: Serve HTML using FS module
    else if (req.method === "GET" && url.pathname === "/home") {
        fs.readFile("./public/index.html", (err, data) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error reading HTML file");
            } else {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        });
    }

    // Route 5: Add a book
    else if (req.method === "POST" && url.pathname === "/add-book") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const book = JSON.parse(body);

                if (
                    book.id == null ||
                    !book.title ||
                    !book.author ||
                    book.price == null
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    return res.end(JSON.stringify({
                        message: "All book fields are required"
                    }));
                }

                books.push(book);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Book added successfully",
                    book: book
                }));
            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }
});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});