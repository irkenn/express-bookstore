
require("dotenv").config();
process.env.NODE_ENV === "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

const Book = require("../models/book");


describe("Book Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM books");

    let book1 = await Book.create({
        isbn: "0691161520",
		amazon_url: "http://ass.ogt/gggg",
		author: "Thich Nhat Han",
		language: "english",
		pages: 420,
		publisher: "Penguin",
		title: "Old Road White Clouds",
		year: 2004
    });
    let book2 = await Book.create({
        isbn: "0691161519",
        amazon_url: "http://e.io/weiRd",
        author: "Jordan Peterson",
        language: "english",
        pages: 666,
        publisher: "Anti Woke Press (The Daily Wire)",
        title: "Twelve Rules for life",
        year: 2019
    });
  });

//   /** POST /auth/register => token  */

  describe("Get /books", function () {
    test("responds with a list of all the books", async function () {
        let response = await request(app)
            .get("/books");

        let books = response.body;
        expect(books.books[0]).toEqual({
            isbn: '0691161520',
            amazon_url: 'http://ass.ogt/gggg',
            author: 'Thich Nhat Han',
            language: 'english',
            pages: 420,
            publisher: 'Penguin',
            title: 'Old Road White Clouds',
            year: 2004
        });
        expect(books.books[1]).toEqual({
            isbn: '0691161519',
            amazon_url: 'http://e.io/weiRd',
            author: 'Jordan Peterson',
            language: 'english',
            pages: 666,
            publisher: 'Anti Woke Press (The Daily Wire)',
            title: 'Twelve Rules for life',
            year: 2019
        });
    });
  });

  /** POST /auth/login => token  */

    describe("POST /books", function () {
        test("returns the book", async function () {
            let response = await request(app)
                .post("/books")
                .send({  
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "english",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    year: 2017
                });
            let books = response.body;
            expect(books.book.author).toEqual("Matthew Lane");
        });

        test("the book is added to the database", async function(){
            let postRequest = await request(app)
            .post("/books")
            .send({  
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            });
            let booksArray = await Book.findAll();

            let singleBook = postRequest.body.book;
            
            expect(booksArray)
                .toEqual(expect.arrayContaining([expect.objectContaining(singleBook)]));
        });

        test("Invalid URL, it throws an error ", async function () {
            let response = await request(app)
                .post("/books")
                .send({  
                    isbn: "0691161518",
                    amazon_url: "not-a-url",
                    author: "Matthew Lane",
                    language: "english",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    year: 2017
                });
            expect(response.statusCode).toEqual(400);
        });
    });
    
    describe("PUT /books", function(){
        test('updates the book', async function (){
            let bookBefore = await Book.findOne("0691161520");
            console.log(bookBefore);
            let response = await request(app)
            .put("/books/0691161520")
            .send({
                isbn: '0691161520',
                amazon_url: 'http://ass.ogt/gggg',
                author: 'Thich Nhat Han',
                language: 'vietnamese',
                pages: 420,
                publisher: 'Motherland Editorial',
                title: 'Old Road White Clouds',
                year: 2004
            });
            expect(response.statusCode).toEqual(200);
            expect(bookBefore.language).toEqual('english');
            expect(bookAfter.language).toEqual('vietnamese');
        });
    });

});

afterAll(async function () {
  await db.end();
});
