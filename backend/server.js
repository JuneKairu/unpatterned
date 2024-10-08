// libraries install express mysql cors nodemon
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "devtest"
});

//code line for sign up needed: missing function user existing / hash pasword
app.post('/Signup', (req, res) => {
  const sql = "INSERT INTO tb_logins (email, password) VALUES (?)";
  const values = [
    req.body.email,
    req.body.password
  ];
  
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json({ message: "Error during signup", error: err });
    }
    return res.json({ message: "Signup successful", data });
  });
});

// code line for Login needed: missing function route to admin if equal value
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM tb_logins WHERE email = ? AND password = ?";
  const values = [req.body.email, req.body.password];
  
  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json({ message: "Error during login attempt", error: err });
    }
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});


// adding new product missing quantity , update btn & remove 
app.post('/addProduct', (req, res) => {
  const { category, name, price } = req.body;

  // init 3 table to select
  let tableName;
  switch (category) {
    case 'uniforms':
      tableName = 'uniforms';
      break;
    case 'schoolsupplies':
      tableName = 'schoolsupplies';
      break;
    case 'lccbmerchandise':
      tableName = 'lccbmerchandise';
      break;
    default:
      return res.status(400).json({ message: 'Invalid category' });
  }

  const sql = `INSERT INTO ${tableName} (name, price) VALUES (?, ?)`;

  db.query(sql, [name, price], (err, result) => {
    if (err) {
      return res.json({ message: "Error adding product", error: err });
    }
    return res.json({ message: "Product added successfully", data: result });
  });
});

// Fetch products by category
app.get('/products/:category', (req, res) => {
  const { category } = req.params;

  // to dirict access the 3 table in sql
  let tableName;
  switch (category) {
    case 'uniforms':
      tableName = 'uniforms';
      break;
    case 'schoolsupplies':
      tableName = 'schoolsupplies';
      break;
    case 'lccbmerchandise':
      tableName = 'lccbmerchandise';
      break;
    default:
      return res.status(400).json({ message: 'Invalid category' });
  }

  const sql = `SELECT * FROM ${tableName}`;
  
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching products", error: err });
    }
    return res.json(data);
  });
});




app.listen(8081, () => {
  console.log("Server running on port 8081");
  console.log("ga gana paman ah");
});
