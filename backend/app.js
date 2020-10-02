const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import Routes
const questionsRoute = require("./routes/questions");
app.use("/questions", questionsRoute);

// Routes
app.get('/', (req, res) => {
    res.send("Home");
});

// Connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION , {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB")
});

// Listen on port 5000
app.listen(port, '0.0.0.0', () => {
    console.log("Listening on port " + port);
});