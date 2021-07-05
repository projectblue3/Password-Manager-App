const Category = require('../models/Category');
const express = require('express');
const router = express.Router();

//Admin gets all categories and can create new ones on page
router.get('/', async (req, res) => {
    try {
        let categoryList = await Category.find();
        res.status(200).send(categoryList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Admin gets a category and can edit or delete it on page
router.get('/:id', async (req, res) => {
    try {
        const cat = await Category.findById(req.params.id);

        if (!cat) {
            return res.status(400).json({ msg: 'Category does not exist' });
        } else {
            res.status(200).send(cat);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Creates new category
router.post('/', async (req, res) => {
    const cat = new Category({
        title: req.body.title,
        icon: req.body.icon,
        color: req.body.color,
    });

    try {
        await cat.save();
        res.status(200).json({ msg: 'Category saved successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({ msg: errors });
        }
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

//Updates a category
router.put('/:id', (req, res) => {
    Category.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            icon: req.body.icon,
            color: req.body.color,
        },
        { runValidators: true }
    )
        .then((category) => {
            if (category) {
                return res.status(200).json({ msg: 'Category updated' });
            } else {
                return res.status(400).json({ msg: 'Category does not exist' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong' });
        });
});

//Deletes a category
router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({ msg: 'Category deleted' });
            } else {
                return res.status(400).json({ msg: 'Category does not exist' });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ msg: 'Something went wrong' });
        });
});

module.exports = router;
