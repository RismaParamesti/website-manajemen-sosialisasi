const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const educationUnitsRoute = require("./routes/educationUnits");
const healthFacilitiesRoute = require("./routes/healthFacilities");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/education_units", educationUnitsRoute);
app.use("/health_facilities", healthFacilitiesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
