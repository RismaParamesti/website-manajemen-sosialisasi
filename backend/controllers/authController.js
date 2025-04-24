const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

exports.register = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (results.length) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users SET ?", { username, email, password: hashedPassword, role }, (err) => {
      if (err) return res.status(500).json({ message: "Gagal mendaftar" });
      res.status(201).json({ message: "Registrasi berhasil" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Email tidak ditemukan" });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role });
  });
};

exports.forgotPassword = (req, res) => {
  const { email, newPassword } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
      if (err) return res.status(500).json({ message: "Gagal reset password" });
      res.json({ message: "Password berhasil direset" });
    });
  });
};
