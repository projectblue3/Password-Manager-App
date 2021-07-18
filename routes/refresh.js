const User = require('../models/User');
const express = require('express');
const router = express.Router();
const CustomError = require('../utils/CustomError');
const validateRefresh = require('../middleware/validateRefresh');

router.post('/', validateRefresh, async (req, res, next) => {
    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        accessToken = user.getSignedJwtToken();

        res.json({ success: true, msg: 'Authenticated', accessToken });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
