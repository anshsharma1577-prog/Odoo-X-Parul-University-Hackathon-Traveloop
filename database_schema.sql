-- ==========================================
-- TRAVELOOP MYSQL DATABASE SCHEMA
-- ==========================================

-- 1. TRIPS TABLE (You likely already have this based on server.js)
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE (For login.html)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ACTIVITIES TABLE (For activities.html)
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT, -- Links to the trip
    title VARCHAR(255) NOT NULL,
    activity_date DATE,
    activity_time TIME,
    location VARCHAR(255),
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 4. BUDGET / EXPENSES TABLE (For budget.html)
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT, -- Links to the trip
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
