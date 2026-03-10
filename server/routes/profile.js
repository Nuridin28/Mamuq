const express = require('express');
const { Profile, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
});

// PUT /api/profile
router.put('/', async (req, res) => {
  try {
    const {
      leftHandMobility,
      rightHandMobility,
      fabricSensitivity,
      fastenerPreference,
      neckWidth,
      sleeveType,
      needsSoftSeams,
      wheelchairUser,
      sensitiveAreas,
      additionalNotes,
    } = req.body;

    const profileData = {
      userId: req.user.id,
      leftHandMobility,
      rightHandMobility,
      fabricSensitivity,
      fastenerPreference,
      neckWidth,
      sleeveType,
      needsSoftSeams,
      wheelchairUser,
      sensitiveAreas,
      additionalNotes,
    };

    let profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (profile) {
      await profile.update(profileData);
    } else {
      profile = await Profile.create(profileData);
    }

    res.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// DELETE /api/profile
router.delete('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    await profile.destroy();
    res.json({ message: 'Profile and associated data deleted successfully.' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile.' });
  }
});

module.exports = router;
