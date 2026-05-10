const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const SECRET_KEY = "my_super_secret_hackathon_key";

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON requests
app.use(express.static(__dirname)); // Serves all your HTML/CSS/JS files!

// Serve login.html when someone visits localhost:3000
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// ============================================
// MySQL DATABASE CONNECTION CONFIGURATION
// ============================================
// NOTE: Change these credentials to match your local MySQL setup
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',      
    password: process.env.DB_PASSWORD || '12345', 
    database: process.env.DB_NAME || 'traveloop' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        console.log('\n--- IMPORTANT! ---');
        console.log('Make sure MySQL is running, and you have created the "traveloop" database!');
    } else {
        console.log('Successfully connected to MySQL database!');
    }
});

// ============================================
// TRIPS API
// ============================================
app.get('/api/trips', (req, res) => {
    const sql = 'SELECT * FROM trips ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.post('/api/trips', (req, res) => {
    const { name, start_date, end_date, description } = req.body;
    const defaultImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=60";
    
    const sql = 'INSERT INTO trips (trip_name, start_date, end_date, description, cover_image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, start_date, end_date, description, defaultImage], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to insert into database' });
        res.status(201).json({ message: 'Trip created successfully!', id: result.insertId });
    });
});

// ============================================
// USERS API (Login, Signup, Reset Password)
// ============================================

app.post('/api/users/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password securely!
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User created securely', userId: result.insertId, username });
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error hashing password' });
    }
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid email' });
        
        const user = results[0];
        
        // Check if the hashed password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
        
        // Generate JWT Token
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        
        res.json({ message: 'Login successful', token: token, username: user.username, userId: user.id });
    });
});

app.put('/api/users/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        // Hash the new password before saving it
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(sql, [hashedNewPassword, email], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Email not found in our system' });
            
            res.json({ message: 'Password reset successfully' });
        });
    } catch(e) {
        res.status(500).json({ error: 'Server error hashing password' });
    }
});

// ============================================
// EXPENSES API (Budget)
// ============================================

app.get('/api/expenses', (req, res) => {
    const sql = 'SELECT * FROM expenses ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

app.post('/api/expenses', (req, res) => {
    const { category, amount, date } = req.body;
    const sql = 'INSERT INTO expenses (trip_id, category, amount, expense_date) VALUES (1, ?, ?, ?)';
    db.query(sql, [category, amount, date], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add expense' });
        res.status(201).json({ message: 'Expense added' });
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`🚀 Traveloop Secure Backend Server is running on http://localhost:${port}`);
});
