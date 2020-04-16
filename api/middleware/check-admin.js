

module.exports = (req, res, next) => {
    if(req.userData.adim!=1) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    next();
};