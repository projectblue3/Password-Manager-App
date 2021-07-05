const Password = require('../models/Password');
const express = require('express');
const router = express.Router();

//Page where user gets their own passwords
router.get('/', async (req, res) => {
    const cat = req.query.cat;
    const letter = req.query.letter;

    try {
        let passwordList = await Password.find().populate('category');

        if (cat) {
            passwordList = await Password.find({ category: cat }).populate('category').exec();
        }

        if (letter) {
            //add this
        }

        res.status(200).send(passwordList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Page where user gets one of their passwords and can edit or delete it
router.get('/:id', async (req, res) => {
    try {
        const pass = await Password.findById(req.params.id).populate('category');

        if (!pass) {
            return res.status(400).json({ msg: 'Password does not exist' });
        } else {
            res.status(200).send(pass);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Creates new password
router.post('/', async (req, res) => {
    const pass = new Password({
        title: req.body.title,
        category: req.body.category,
        username: req.body.username,
        password: req.body.password,
        note: req.body.note,
    });

    try {
        await pass.save();
        res.status(200).json({ msg: 'Password saved successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({ msg: errors });
        }
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Updates password
router.put('/:id', (req, res) => {
    Password.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            category: req.body.category,
            username: req.body.username,
            password: req.body.password,
            note: req.body.note,
        },
        { runValidators: true }
    )
        .then((password) => {
            if (password) {
                return res.status(200).json({ msg: 'Password updated' });
            } else {
                return res.status(400).json({ msg: 'Password does not exist' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong' });
        });
});

//Deletes password
router.delete('/:id', (req, res) => {
    Password.findByIdAndDelete(req.params.id)
        .then((password) => {
            if (password) {
                return res.status(200).json({ msg: 'Password deleted' });
            } else {
                return res.status(400).json({ msg: 'Password does not exist' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong' });
        });
});

module.exports = router;
