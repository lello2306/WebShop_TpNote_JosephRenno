const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'adm',
    password: 'adm',
    database: 'webshop'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL Connected...');
});

app.get('/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.get('/products/:id', (req, res) => {
    let sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(`Error fetching product with id ${req.params.id}:`, err);
            res.status(500).send('Server error');
            return;
        }
        res.json(result);
    });
});

app.post('/products', (req, res) => {
    let newProduct = req.body;
    let sql = 'INSERT INTO products SET ?';
    db.query(sql, newProduct, (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json({ id: result.insertId, ...newProduct });
    });
});

app.put('/products/:id', (req, res) => {
    let updatedProduct = req.body;
    let sql = `UPDATE products SET ? WHERE id = ${req.params.id}`;
    db.query(sql, updatedProduct, (err, result) => {
        if (err) {
            console.error(`Error updating product with id ${req.params.id}:`, err);
            res.status(500).send('Server error');
            return;
        }
        res.json(result);
    });
});

app.delete('/products/:id', (req, res) => {
    let sql = `DELETE FROM products WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(`Error deleting product with id ${req.params.id}:`, err);
            res.status(500).send('Server error');
            return;
        }
        res.json(result);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
