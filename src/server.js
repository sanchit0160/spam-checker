// Importing required modules

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
const user = require('./routes/v1/user');
const spam = require('./routes/v1/spam');
const search = require('./routes/v1/search');


// Middlewares
app.use(express.json());
app.use(cors());


// Route for the root endpoint
app.get('/', (request, response) => {
  return response.status(200).json({ status: 'server running' })
});


// routes for specific functionalities using imported modules
app.use('/v1/user', user);
app.use('/v1/spam', spam);
app.use('/v1/search', search);


// Function to start the server and listen on the specified port
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`--server started running at PORT=${PORT}--`);
  });
};

module.exports = startServer;