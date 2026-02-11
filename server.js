const express = require ('express')
const mysql = require ('mysql')
const path = require('path')

const app = express();

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'testdb',
    port:3307
})

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../')));

db.connect((err) => {
    if (err){
        console.log('connected to the MySQL database',err);
        return;
    }
    console.log('connected to the MySQL.database');
});

// Routes
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

app.post('/register', (req, res) => {
    const { firstName, secondName, email, contactNo } = req.body;
    
    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        
        db.query('INSERT INTO users SET ?', { firstName, secondName, email, contactNo }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ message: 'User registered successfully' });
        });
    });
});

