const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  leftHandMobility: {
    type: DataTypes.ENUM('full', 'limited', 'none'),
    defaultValue: 'full',
  },
  rightHandMobility: {
    type: DataTypes.ENUM('full', 'limited', 'none'),
    defaultValue: 'full',
  },
  fabricSensitivity: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  fastenerPreference: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    validate: {
      isValidFasteners(value) {
        const allowed = ['velcro', 'magnets', 'side-zipper', 'front-zipper'];
        if (value && value.some((v) => !allowed.includes(v))) {
          throw new Error('Invalid fastener preference. Allowed: velcro, magnets, side-zipper, front-zipper');
        }
      },
    },
  },
  neckWidth: {
    type: DataTypes.ENUM('standard', 'wide', 'extra-wide'),
    defaultValue: 'standard',
  },
  sleeveType: {
    type: DataTypes.ENUM('standard', 'wide', 'raglan'),
    defaultValue: 'standard',
  },
  needsSoftSeams: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wheelchairUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sensitiveAreas: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  additionalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'profiles',
});

module.exports = Profile;
