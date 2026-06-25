const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./auth"));
app.use("/api/projects", require("./projectRoutes"));
app.use("/api/applications", require("./applicationRoutes"));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});