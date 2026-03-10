const express = require('express');
const { Op } = require('sequelize');
const { Product, Profile } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - list with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      fastenerType,
      neckWidth,
      sleeveType,
      wheelchair,
      softSeams,
      fabricType,
      inStock,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const where = {};

    if (category) where.category = category;
    if (neckWidth) where.neckWidth = neckWidth;
    if (sleeveType) where.sleeveType = sleeveType;
    if (wheelchair === 'true') where.suitableForWheelchair = true;
    if (softSeams === 'true') where.hasSoftSeams = true;
    if (fabricType) where.fabricType = { [Op.iLike]: `%${fabricType}%` };
    if (inStock !== undefined) where.inStock = inStock === 'true';

    if (fastenerType) {
      where.fastenerTypes = { [Op.contains]: [fastenerType] };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.basePrice[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { nameEn: { [Op.iLike]: `%${search}%` } },
        { nameRu: { [Op.iLike]: `%${search}%` } },
        { nameKz: { [Op.iLike]: `%${search}%` } },
        { descriptionEn: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({ products });
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ error: 'Failed to list products.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product.' });
  }
});

// POST /api/products - admin only
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// PUT /api/products/:id - admin only
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    await product.update(req.body);
    res.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// POST /api/products/:id/recommend - suitability score based on user profile
router.post('/:id/recommend', authenticate, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found. Please create a profile first.' });
    }

    const { score, notes } = calculateSuitability(product, profile);

    res.json({
      productId: product.id,
      suitabilityScore: score,
      maxScore: 100,
      percentage: Math.round(score),
      customizationNotes: notes,
    });
  } catch (error) {
    console.error('Recommend error:', error);
    res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
});

function calculateSuitability(product, profile) {
  let score = 100;
  const notes = [];

  // Fastener compatibility
  if (profile.fastenerPreference && profile.fastenerPreference.length > 0) {
    const productFasteners = product.fastenerTypes || [];
    const matchingFasteners = profile.fastenerPreference.filter((f) =>
      productFasteners.includes(f)
    );
    if (productFasteners.length > 0 && matchingFasteners.length === 0) {
      score -= 25;
      notes.push(`Fastener mismatch: product uses ${productFasteners.join(', ')}, you prefer ${profile.fastenerPreference.join(', ')}.`);
    } else if (matchingFasteners.length > 0) {
      notes.push(`Compatible fasteners: ${matchingFasteners.join(', ')}.`);
    }
  }

  // Hand mobility and fastener difficulty
  if (profile.leftHandMobility === 'none' || profile.rightHandMobility === 'none') {
    const productFasteners = product.fastenerTypes || [];
    if (productFasteners.includes('front-zipper') || productFasteners.includes('side-zipper')) {
      score -= 15;
      notes.push('Zippers may be difficult with limited hand mobility. Consider velcro or magnetic alternatives.');
    }
    if (productFasteners.includes('velcro') || productFasteners.includes('magnets')) {
      notes.push('This product uses easy-to-use fasteners suitable for limited hand mobility.');
    }
  } else if (profile.leftHandMobility === 'limited' || profile.rightHandMobility === 'limited') {
    const productFasteners = product.fastenerTypes || [];
    if (productFasteners.includes('front-zipper') || productFasteners.includes('side-zipper')) {
      score -= 8;
      notes.push('Zippers may require some assistance with limited hand mobility.');
    }
  }

  // Neck width
  if (profile.neckWidth !== product.neckWidth) {
    if (profile.neckWidth === 'extra-wide' && product.neckWidth === 'standard') {
      score -= 20;
      notes.push('Neck opening is standard width but you need extra-wide. Customization recommended.');
    } else if (profile.neckWidth === 'wide' && product.neckWidth === 'standard') {
      score -= 10;
      notes.push('Neck opening could be wider for your preference.');
    }
  } else if (product.neckWidth && profile.neckWidth === product.neckWidth) {
    notes.push('Neck width matches your preference.');
  }

  // Sleeve type
  if (product.sleeveType && profile.sleeveType !== product.sleeveType) {
    score -= 10;
    notes.push(`Sleeve type is ${product.sleeveType}, but you prefer ${profile.sleeveType}.`);
  }

  // Soft seams
  if (profile.needsSoftSeams && !product.hasSoftSeams) {
    score -= 15;
    notes.push('This product does not have soft seams. You may experience discomfort.');
  } else if (profile.needsSoftSeams && product.hasSoftSeams) {
    notes.push('This product has soft seams, matching your sensitivity needs.');
  }

  // Wheelchair suitability
  if (profile.wheelchairUser && !product.suitableForWheelchair) {
    score -= 20;
    notes.push('This product is not specifically designed for wheelchair users.');
  } else if (profile.wheelchairUser && product.suitableForWheelchair) {
    notes.push('This product is designed for wheelchair users.');
  }

  // Fabric sensitivity
  if (profile.fabricSensitivity && profile.fabricSensitivity.length > 0 && product.fabricType) {
    const sensitiveToFabric = profile.fabricSensitivity.some((s) =>
      product.fabricType.toLowerCase().includes(s.toLowerCase())
    );
    if (sensitiveToFabric) {
      score -= 30;
      notes.push(`Warning: This product uses ${product.fabricType}, which is in your fabric sensitivity list.`);
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  if (notes.length === 0) {
    notes.push('This product appears generally compatible with your profile.');
  }

  return { score, notes };
}

module.exports = router;
