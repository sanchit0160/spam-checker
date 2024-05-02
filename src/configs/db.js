// Importing Sequelize for database interactions
const { Sequelize } = require('sequelize');

// Creating a Sequelize instance for SQLite database connection
const sequelize = new Sequelize('spam-checker', 'user', 'pass', {
  dialect: 'sqlite',
  host: './database/id.sqlite'
});

// Function to connect to the database
const connectToDB = async () => {
  try {
    // Authenticate the connection to the database
    await sequelize.authenticate();
    console.log('--connected to sqlite--');

    // Synchronize all defined models with the database
    await sequelize.sync();
    console.log("--all models were synchronized successfully--");

    // Return true if the connection and synchronization are successful
    return true;
  } catch (error) {
    // Log any errors that occur during the connection process
    console.error(error);
  }
}

module.exports = { connectToDB, sequelize };