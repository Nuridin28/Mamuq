const sequelize = require('../db');
const User = require('./User');
const Profile = require('./Profile');
const Product = require('./Product');
const Order = require('./Order');
const Analytics = require('./Analytics');

// Associations
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Profile,
  Product,
  Order,
  Analytics,
};
