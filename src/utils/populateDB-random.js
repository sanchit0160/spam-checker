const { sequelize } = require('../configs/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getRandomLetters = (length) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

const generateRandomPhone = () => {
  const remainingDigits = Math.floor(1000 + Math.random() * 9000);
  return `880233${remainingDigits}`;
};

const generateRandomContactPhone = () => {
  const remainingDigits = Math.floor(10000 + Math.random() * 90000);
  return `70111${remainingDigits}`;
};

const generateRandomEmail = () => {
  const prefix = getRandomLetters(4);
  return `${prefix}.${getRandomLetters(4)}@gmail.com`;
};

const generateRandomUser = () => ({
  name: `Sanchit ${getRandomLetters(4)}`,
  phone: generateRandomPhone(),
  email: generateRandomEmail(),
  password: '123456',
  contacts: JSON.stringify([
    {
      contactName: `Parul ${getRandomLetters(4)}`,
      contactPhone: generateRandomContactPhone(),
    },
  ]),
});

const populateDBRANDOM = async (numberOfUsers) => {
  try {
    // Synchronize the database, dropping existing tables (force: true)
    await sequelize.sync({ force: true });

    for (let i = 0; i < numberOfUsers; i++) {
      let randomUser = generateRandomUser();

      // Generate a salt for password hashing
      const salt = await bcrypt.genSalt(10);
      randomUser.password = await bcrypt.hash(randomUser.password, salt);

      await User.create(randomUser);

      // Generate a JWT token for the user's phone number
      const payload = { user: { phone: randomUser.phone } };
      jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        console.log(`JWT [use it in Authorization Header] = ${token}`);
      });

      
    }

    console.log(`${numberOfUsers} random users added to the database.`);
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

module.exports = populateDBRANDOM;
