const express = require('express');
const connectToMongo = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');

const createAdminUser = require('./CreateAdmin');

connectToMongo();
const app = express();
const PORT = 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/blog', require('./routes/blog'))

// createAdminUser();

app.listen(PORT, () => {
    console.log(`Ai Blog Server running at http://localhost:${PORT}`)
})