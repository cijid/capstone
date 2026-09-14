const {sign, verify} = require('jsonwebtoken');
const nodemon = require('nodemon');
require('dotenv').config();

const createTokens = (user) => {
    const accessToken = sign({ email: user.email, id: user.id }, process.env.JWT_SECRET);

    return accessToken;
};

module.exports = { createTokens };