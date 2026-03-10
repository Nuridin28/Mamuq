const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const { Analytics, User, Order } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');
const sequelize = require('../db');

const router = express.Router();

// Reference to online users map (set from index.js)
let onlineUsersMap = new Map();

const setOnlineUsersMap = (map) => {
  onlineUsersMap = map;
};

// POST /api/analytics/event - no auth required
router.post('/event', async (req, res) => {
  try {
    const { eventType, userId, sessionId, page, buttonName, metadata, duration, ipAddress } = req.body;

    if (!eventType || !sessionId) {
      return res.status(400).json({ error: 'eventType and sessionId are required.' });
    }

    const event = await Analytics.create({
      eventType,
      userId: userId || null,
      sessionId,
      page: page || null,
      buttonName: buttonName || null,
      metadata: metadata || {},
      duration: duration || null,
      ipAddress: ipAddress || req.ip,
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error('Log analytics event error:', error);
    res.status(500).json({ error: 'Failed to log event.' });
  }
});

// GET /api/analytics/dashboard - admin only
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total users
    const totalUsers = await User.count();

    // Online users from WebSocket
    const onlineUsers = onlineUsersMap.size;

    // Buy clicks over last 30 days (daily)
    const buyClicksDaily = await Analytics.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        eventType: 'buy_click',
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true,
    });

    // Page views by page
    const pageViews = await Analytics.findAll({
      attributes: [
        'page',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        eventType: 'page_view',
      },
      group: ['page'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true,
    });

    // Average session duration
    const avgDuration = await Analytics.findOne({
      attributes: [
        [fn('AVG', col('duration')), 'avgDuration'],
      ],
      where: {
        eventType: 'session_end',
        duration: { [Op.not]: null },
      },
      raw: true,
    });

    // Button click counts by name
    const buttonClicks = await Analytics.findAll({
      attributes: [
        'buttonName',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        eventType: 'button_click',
        buttonName: { [Op.not]: null },
      },
      group: ['buttonName'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true,
    });

    // Users by language
    const usersByLanguage = await User.findAll({
      attributes: [
        'language',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['language'],
      raw: true,
    });

    // Recent events (last 50)
    const recentEvents = await Analytics.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    res.json({
      totalUsers,
      onlineUsers,
      buyClicksDaily,
      pageViews,
      averageSessionDuration: avgDuration ? parseFloat(avgDuration.avgDuration) || 0 : 0,
      buttonClicks,
      usersByLanguage,
      recentEvents,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to get dashboard analytics.' });
  }
});

// GET /api/analytics/buy-analytics - admin only
router.get('/buy-analytics', authenticate, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Buy clicks per day/week/month
    const buyClicksDay = await Analytics.count({
      where: { eventType: 'buy_click', createdAt: { [Op.gte]: oneDayAgo } },
    });
    const buyClicksWeek = await Analytics.count({
      where: { eventType: 'buy_click', createdAt: { [Op.gte]: oneWeekAgo } },
    });
    const buyClicksMonth = await Analytics.count({
      where: { eventType: 'buy_click', createdAt: { [Op.gte]: oneMonthAgo } },
    });

    // Total sessions
    const totalSessions = await Analytics.count({
      where: { eventType: 'session_start' },
      distinct: true,
      col: 'sessionId',
    });

    // Total buy clicks
    const totalBuyClicks = await Analytics.count({
      where: { eventType: 'buy_click' },
    });

    // Conversion rate
    const conversionRate = totalSessions > 0
      ? ((totalBuyClicks / totalSessions) * 100).toFixed(2)
      : 0;

    // Popular products (from buy_click metadata)
    const popularProducts = await Analytics.findAll({
      attributes: [
        [literal("metadata->>'productId'"), 'productId'],
        [fn('COUNT', col('id')), 'buyCount'],
      ],
      where: {
        eventType: 'buy_click',
      },
      group: [literal("metadata->>'productId'")],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Revenue over time (daily, last 30 days)
    const revenueDaily = await Order.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('SUM', col('totalPrice')), 'revenue'],
        [fn('COUNT', col('id')), 'orderCount'],
      ],
      where: {
        createdAt: { [Op.gte]: oneMonthAgo },
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true,
    });

    res.json({
      buyClicks: {
        day: buyClicksDay,
        week: buyClicksWeek,
        month: buyClicksMonth,
      },
      conversionRate: parseFloat(conversionRate),
      totalSessions,
      totalBuyClicks,
      popularProducts,
      revenueDaily,
    });
  } catch (error) {
    console.error('Buy analytics error:', error);
    res.status(500).json({ error: 'Failed to get buy analytics.' });
  }
});

module.exports = router;
module.exports.setOnlineUsersMap = setOnlineUsersMap;
