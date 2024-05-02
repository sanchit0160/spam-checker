// Importing necessary modules and functions
const { connectToDB, sequelize } = require('./src/configs/db');
const populateDBRANDOM = require('./src/utils/populateDB-random');
const populateDBJSON = require('./src/utils/populateDB-json');
const startServer = require('./src/server');

// Function to start the application
const startApp = async () => {
  // Connect to the database
  await connectToDB();
  
  // Populate the database with random data (5 records)
  await populateDBRANDOM(5);

  // Uncomment the line below to populate the database with JSON data
  // await populateDBJSON();
  
  // Start the server
  await startServer();
};

startApp();