const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const educationUnitsRoute = require("./routes/educationUnits");
const healthFacilitiesRoute = require("./routes/healthFacilities");
const publicHousingsRoute = require("./routes/publicHousings");
const mallsRoute = require("./routes/malls");
const hotelsRoute = require("./routes/hotels");
const officesRoute = require("./routes/offices");
const apartementsRoute = require("./routes/apartements");
const urbanVillageRoute = require("./routes/urbanVillage");
const dashboardRoute = require("./routes/dashboard");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/education_units", educationUnitsRoute);
app.use("/health_facilities", healthFacilitiesRoute);
app.use("/public_housings", publicHousingsRoute);
app.use("/malls", mallsRoute);
app.use("/hotels", hotelsRoute);
app.use("/offices", officesRoute);
app.use("/apartements", apartementsRoute);
app.use("/urban_village", urbanVillageRoute);

// Add new routes for statistics
app.use("/dashboard", dashboardRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
