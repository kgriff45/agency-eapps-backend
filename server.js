// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const renewalapps = require('./routes/renewal-app');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/renewalapp', renewalapps);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});