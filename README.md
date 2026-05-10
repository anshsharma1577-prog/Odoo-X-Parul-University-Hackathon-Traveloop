# Traveloop ♾️
A Full-Stack Travel Management Dashboard built for the Hackathon.

## Features
- **Secure Authentication**: Encrypted Password Hashing (bcrypt) & JWT Sessions.
- **Dynamic Database**: Fully integrated MySQL backend for Users, Trips, and Expenses.
- **Responsive UI**: Glassmorphism aesthetic, Mobile Hamburger Menus, and fluid animations.
- **Interactive Prototyping**: Global hooks to handle all hackathon prototype interactions.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS (Custom Design System), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL

---

## 🚀 How to Run Locally (For Testers & Judges)

### Prerequisites
1. You must have **Node.js** installed on your computer.
2. You must have **MySQL Server** installed (e.g., MySQL Workbench).

### Step 1: Install Dependencies
Open your terminal inside this project folder and run:
```bash
npm install express mysql2 cors bcrypt jsonwebtoken
```

### Step 2: Setup the Database
1. Open MySQL Workbench.
2. Open the `database_schema.sql` file included in this repository.
3. Run the entire SQL script (using the lightning bolt icon) to automatically create the `traveloop` database and all necessary tables.

### Step 3: Configure Database Credentials
1. Open `server.js` in your code editor.
2. Go to **line 22** and update the MySQL connection settings to match your local machine's MySQL credentials (specifically the `password` field).

### Step 4: Start the Server
Run the following command in your terminal:
```bash
node server.js
```
*You should see the message: `🚀 Traveloop Secure Backend Server is running`*

### Step 5: Open the App
1. Open your web browser and navigate directly to:
   **http://localhost:3000**
2. Create a new account via the Signup page to test the encrypted authentication.

---
*Built with ❤️ for the Hackathon.*
