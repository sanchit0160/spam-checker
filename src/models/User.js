const { sequelize } = require('../configs/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  // 'name' field representing the user's name
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 'phone' field representing the user's phone number, set as the primary key
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING
  },
  // 'password' field representing the user's encoded password 
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacts: {
    // this string contains contacts json
    // "[{\"contactName\":\"Aman\",\"contactPhone\":9971394910}]"
    type: DataTypes.STRING
  },
  markedSpamNumbers: {
    // this string contains markedSpamNumbers json
    // "[\"8802332239\", \"9971394910\"]"
    type: DataTypes.STRING,
  },
}, {
  timestamps: false
});

module.exports = User;