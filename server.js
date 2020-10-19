const path = require("path");
const express = require('express');
const connectDb = require("./config/db");
require("dotenv").config();

const app = express();
const authRouter = require('./routes/auth');
const docRouter = require('./routes/documents');
const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');

// Database
connectDb();

// Init middleware
app.use(express.json({ extended: false })); // Allows to accept data within a body of a request (req.body)

// Routes
app.use('/api/auth', authRouter);
app.use('/api/documents', docRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// to run locally: `npm run dev`
// to run deploy: `git push heroku master`