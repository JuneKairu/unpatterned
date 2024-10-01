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

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
