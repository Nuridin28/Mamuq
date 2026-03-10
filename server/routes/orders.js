const express = require('express');
const { Order, Product, Analytics } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ orders });
  } catch (error) {
    console.error('List orders error:', error);
    res.status(500).json({ error: 'Failed to list orders.' });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required.' });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      if (!product.inStock) {
        return res.status(400).json({ error: `Product out of stock: ${product.nameEn}` });
      }
      totalPrice += parseFloat(product.basePrice) * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalPrice,
      shippingAddress,
      status: 'pending',
    });

    // Log buy_click analytics event for each item
    for (const item of items) {
      await Analytics.create({
        eventType: 'buy_click',
        userId: req.user.id,
        sessionId: req.body.sessionId || `order-${order.id}`,
        page: '/checkout',
        metadata: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          customizations: item.customizations || null,
        },
        ipAddress: req.ip,
      });
    }

    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Users can only see their own orders unless admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order.' });
  }
});

// PUT /api/orders/:id/status - admin only
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    await order.update({ status });
    res.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

module.exports = router;
