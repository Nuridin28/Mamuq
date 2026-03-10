const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidItems(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Order must contain at least one item');
        }
        for (const item of value) {
          if (!item.productId || !item.quantity) {
            throw new Error('Each item must have productId and quantity');
          }
        }
      },
    },
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered'),
    defaultValue: 'pending',
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: 'orders',
  updatedAt: false,
});

module.exports = Order;
