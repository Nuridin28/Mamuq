const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['page_view', 'button_click', 'buy_click', 'session_start', 'session_end']],
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  page: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  buttonName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds',
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'analytics',
  updatedAt: false,
  createdAt: 'createdAt',
});

module.exports = Analytics;
