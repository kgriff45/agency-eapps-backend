// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

require("./scheduled-events/send-renewal-notice");

const renewalapps = require('./routes/renewal-app');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/renewalapp', renewalapps);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});