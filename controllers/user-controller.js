const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//user-controller.js
const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json("check your data");

    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email: email });
    if (existingUser)
        return res.status(400).json("user exist");

    let hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
        name,
        email,
        password: hashedPassword
    });

    try { await createdUser.save() } catch (err) { }

    let token;
    token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        'supersecretkey',
        { expiresIn: '1h' });
    res.status(201).json({ token: token, userId: createdUser.id });
};
//user-controller.js
const login = async (req, res) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) { }

    if (!existingUser)
        return res.status(200).json('Invalid credentials, could not log you in');

    let isValidPassword = await bcrypt.compare(password, existingUser.password);

    if (!isValidPassword)
        return res.status(400).json('Invalid credentials, could not log you in.');

    let token;
    token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        'supersecretkey',
        { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: existingUser.id });
};

exports.register= register;
exports.login = login;