const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ msg: 'This will be the homepage' });
});

module.exports = router;
