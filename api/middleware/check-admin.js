

module.exports = (req, res, next) => {
    if(req.userData.admin!=1) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    next();
};