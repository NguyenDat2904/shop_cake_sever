const author = (req, res, next) => {
    const role = req.user.role;
    if (role !== 'admin') {
        return res.status(400).json({ error: 'You are not an admin' });
    }
    next();
};

module.exports = author;
