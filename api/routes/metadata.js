const express = require('express');
const router = express.Router();
const Domain = require('../models/domain.model');
const Lifecycle = require('../models/lifecycle.model');
const Region = require('../models/region.model');
const Role = require('../models/role.model');

// Get all Trusted AI Providers
router.get('/', async (req, res) => {
  try {
    const domain = await Domain.find();
    const lifecycle = await Lifecycle.find();
    const region = await Region.find();
    const roles = await Role.find();

    res.json({ domain, lifecycle, region, roles });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
