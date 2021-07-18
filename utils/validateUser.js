const User = require('../models/User');
const CustomError = require('./CustomError');

async function validateUser(paramsId, tokenId, next) {
    const user = await User.findById(tokenId);

    if (!user) {
        return next(new CustomError('UserNotFoundError'));
    }

    if (!user._id.equals(paramsId)) {
        return next(new CustomError('ForbiddenError'));
    }

    return user;
}

module.exports = validateUser;
