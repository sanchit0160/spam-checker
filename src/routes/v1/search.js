const express = require('express');
const authCheck = require('../../middlewares/authCheck');
const searchController = require('../../controllers/search');
const router = express.Router();

// search route to search user by name [xyz*] or [*xyz*]
router.get('/byName/:name', authCheck, searchController.byName);
// search route to search user by phone
router.get('/byPhone/:phone', authCheck, searchController.byPhone);

module.exports = router;