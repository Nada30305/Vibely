
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Club = sequelize.define('Club', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  icon: {
    type: DataTypes.STRING,
    defaultValue: '🎓'
  }

});

module.exports = Club;
