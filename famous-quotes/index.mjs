import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));
//setting up database connection pool, replace values in red
const pool = mysql.createPool({
    host: "k2pdcy98kpcsweia.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "mz8sw6l1pjgk5xi7",
    password: "gviov21m7athk651",
    database: "y0h61ff3oe7mw8lx",
    connectionLimit: 10,
    waitForConnections: true
});
//routes
app.get('/', async (req, res) => {
//    res.render('home');
let authorSql = `SELECT authorId, firstName, lastName
                  FROM authors
                  ORDER BY lastName`;
let categorySql = `SELECT DISTINCT category
                         FROM quotes
                         WHERE category IS NOT NULL
                         ORDER BY category`;
    const [[authors], [categories]] = await Promise.all([
        pool.query(authorSql),
        pool.query(categorySql)
    ]);
    res.render('home.ejs', {authors, categories})
});
app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByKeyword", async(req, res) => {
   try {
        let keyword = req.query.keyword;
    let sql = `SELECT quote, authorId, firstName, lastname AS lastName
                   FROM quotes
                   NATURAL JOIN authors
            WHERE quote LIKE ?`; 

        let sqlParams = [`%${keyword}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByAuthor", async(req, res) => {
   try {
        let author = req.query.author;
    let sql = `SELECT quote, authorId, firstName, lastname AS lastName
                   FROM quotes
                   NATURAL JOIN authors
           WHERE CONCAT(firstName, ' ', lastName) LIKE ?`;
        let sqlParams = [`%${author}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotesA.ejs', {rows});

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByCategory", async(req, res) => {
   try {
        let category = req.query.category;
    let sql = `SELECT DISTINCT quote, authorId, firstName, lastname AS lastName, category
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE category LIKE ?`; 
        let sqlParams = [`%${category}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByLikes", async(req, res) => {
   try {
        let likeStart = req.query.likeStart;
        let likeEnd = req.query.likeEnd;
    let sql = `SELECT quote, firstName, lastName
               FROM quotes
               NATURAL JOIN authors
               WHERE likes BETWEEN ? AND ?`;
        let sqlParams = [likeStart, likeEnd];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('searchByLikes.ejs', {rows});

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/author", async(req, res) => {
   try {
    let authorId = Number.parseInt(req.query.authorId, 10) || 1;
        let sql = `SELECT * FROM authors WHERE authorId = ?`;
        let sqlParams = [authorId];
        const [resultRows] = await pool.query(sql, sqlParams);
        const rows = resultRows[0] || null;
        res.render('author.ejs', {rows});

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})
