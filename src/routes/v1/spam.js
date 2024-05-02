const express = require('express');
const authCheck = require('../../middlewares/authCheck');
const spamController = require('../../controllers/spam');
const router = express.Router();

// spam route such that any auth user can mark any number as spam
router.post('/markSpam', authCheck, spamController.markSpam);
// spam route to umark number as spam
router.post('/unmarkSpam', authCheck, spamController.unmarkSpam);
// spam route to check if number is spam or not
router.get('/isSpam/:phone', authCheck, spamController.isSpam);

module.exports = router;