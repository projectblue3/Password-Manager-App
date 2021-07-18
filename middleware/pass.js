const pass = (req, res, next) => {
    const passRegex = /^(?!.* )(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])/;
    const password = req.body.password;
    const passMax = 32;
    const passMin = 8;

    if (password) {
        if (!passRegex.test(password)) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        if (password.length < passMin) {
            return res.status(400).json({ msg: 'Password Too Short: Must be 8 - 32 Characters' });
        }

        if (password.length > passMax) {
            return res.status(400).json({ msg: 'Password Too Long: Must be 8 - 32 Characters' });
        }
    }

    next();
};

module.exports = pass;
