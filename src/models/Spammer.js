const { sequelize } = require('../configs/db');
const { DataTypes } = require('sequelize');

const Spammer = sequelize.define('Spammer', {
  // 'phone' field representing the phone number of the spammer
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  // 'flagsCount' field representing the count of flags associated with the spammer's phone
  flagsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: false
});

module.exports = Spammer;