const { sequelize } = require('../configs/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const populateDBJSON = async () => {
  try {
    // Synchronize the database, dropping existing tables (force: true)
    await sequelize.sync({ force: true });

    // Read user data from the 'users.json' file
    const userData = JSON.parse(fs.readFileSync('./src/utils/users.json', 'utf-8'));

    // Loop through each user in the JSON data
    for (const user of userData) {
      // Generate a salt for password hashing
      const salt = await bcrypt.genSalt(10);
      // Hash the user's password using bcrypt
      user.password = await bcrypt.hash(user.password, salt);

      await User.create(user);


      // Generate a JWT token for the user's phone number
      const payload = { user: { phone: user.phone } };
      jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        console.log(`JWT [use it in Authorization Header] = ${token}`);
      });
    }

    console.log(`${userData.length} users added to the database.`);
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

module.exports = populateDBJSON;