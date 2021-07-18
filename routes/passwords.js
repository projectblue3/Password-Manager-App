const Password = require('../models/Password');
const User = require('../models/User');
const express = require('express');
const CustomError = require('../utils/CustomError');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

//Page where user gets their own passwords
router.get('/', validateToken, async (req, res, next) => {
    const cat = req.query.cat;
    const letter = req.query.letter;

    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        let passwordList = await Password.find({ owner: user._id }).populate('category');

        if (cat) {
            passwordList = await Password.find({ category: cat, owner: user._id })
                .populate('category')
                .exec();
        }

        if (letter) {
            //add this
        }

        res.status(200).send(passwordList);
    } catch (error) {
        next(error);
    }
});

//Page where user gets one of their passwords and can edit or delete it
router.get('/:id', validateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        const pass = await Password.findById(req.params.id).populate('category');

        if (!pass) {
            return next(new CustomError('PasswordNotFoundError'));
        }

        if (!pass.owner.equals(user._id)) {
            return next(new CustomError('ForbiddenError'));
        }

        res.status(200).send(pass);
    } catch (error) {
        next(error);
    }
});

//Creates new password
router.post('/', validateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        const pass = new Password({
            title: req.body.title,
            category: req.body.category,
            username: req.body.username,
            password: req.body.password,
            note: req.body.note,
            owner: user._id,
        });

        await pass.save();
        res.status(200).json({ success: true, msg: 'Password saved successfully' });
    } catch (error) {
        next(error);
    }
});

//Updates password
router.put('/:id', validateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        const pass = await Password.findById(req.params.id);

        if (!pass) {
            return next(new CustomError('PasswordNotFoundError'));
        }

        if (!pass.owner.equals(user._id)) {
            return next(new CustomError('ForbiddenError'));
        }

        await Password.updateOne(
            { _id: pass._id },
            {
                title: req.body.title,
                category: req.body.category,
                username: req.body.username,
                password: req.body.password,
                note: req.body.note,
            },
            { runValidators: true }
        );

        res.status(200).json({ success: true, msg: 'Password updated' });
    } catch (error) {
        next(error);
    }
});

//Deletes password
router.delete('/:id', validateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.idInToken);

        if (!user) {
            return next(new CustomError('UserNotFoundError'));
        }

        const pass = await Password.findById(req.params.id);

        if (!pass) {
            return next(new CustomError('PasswordNotFoundError'));
        }

        if (!pass.owner.equals(user._id)) {
            return next(new CustomError('ForbiddenError'));
        }

        await Password.deleteOne({ _id: pass._id });

        res.status(200).json({ success: true, msg: 'Password deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
