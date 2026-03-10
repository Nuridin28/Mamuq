const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nameEn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameRu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameKz: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descriptionEn: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descriptionRu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descriptionKz: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('tops', 'bottoms', 'outerwear', 'underwear', 'accessories'),
    allowNull: false,
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fastenerTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  neckWidth: {
    type: DataTypes.ENUM('standard', 'wide', 'extra-wide'),
    defaultValue: 'standard',
  },
  sleeveType: {
    type: DataTypes.ENUM('standard', 'wide', 'raglan'),
    allowNull: true,
  },
  hasSoftSeams: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  suitableForWheelchair: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fabricType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sizes: {
    type: DataTypes.JSON,
    defaultValue: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  updatedAt: false,
});

module.exports = Product;
