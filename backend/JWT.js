const {sign, verify} = require('jsonwebtoken');
const nodemon = require('nodemon');
require('dotenv').config();

const createTokens = (user) => {
    const accessToken = sign({ email: user.email, id: user.id }, process.env.JWT_SECRET);

    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) return res.status(400).json({validated: false});

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            req.authenticated = true;
            req.userID = validToken.id;
            return next();
        }
    } catch (err) {return res.status(400).json({error: `${err}`, validated: false})};
}

module.exports = { createTokens, validateToken };