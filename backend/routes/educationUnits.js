const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all education units
router.get("/", (req, res) => {
  const sql = `
  SELECT 
    e.id,
    e.name,
    e.address,
    s.name AS subdistrict,
    r.name AS region,
    e.instance,
    e.leader,
    e.activity,
    DATE_FORMAT(e.time, '%d-%m-%Y') as date,
    IF(e.SK IS NULL OR LENGTH(e.SK) = 0, '', e.SK) AS suratK
  FROM education_units e
  JOIN subdistricts s ON e.subdistrict_id = s.id
  JOIN regions r ON s.region_id = r.id
  ORDER BY e.id ASC
`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Fetch subdistricts for a specific region
router.get("/subdistricts", (req, res) => {
  const region = req.query.region;
  const sql = `
  SELECT 
    s.name AS subdistrict,
    COUNT(e.id) AS value
  FROM subdistricts s
  JOIN regions r ON s.region_id = r.id
  LEFT JOIN education_units e ON e.subdistrict_id = s.id
  WHERE r.name = ?
  GROUP BY s.name
`;

  db.query(sql, [region], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Fetch subdistricts for a specific region
router.get("/region/:region", (req, res) => { // Pastikan ini menggunakan :region bukan query
  const region = req.params.region; // Mengambil parameter wilayah
  const sql = `
    SELECT 
      s.name AS subdistrict,
      COUNT(e.id) AS value
    FROM subdistricts s
    JOIN regions r ON s.region_id = r.id
    LEFT JOIN education_units e ON e.subdistrict_id = s.id
    WHERE r.name = ?
    GROUP BY s.name
  `;

  db.query(sql, [region], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Mengirim data sebagai JSON
  });
});


module.exports = router;
