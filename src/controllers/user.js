const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = {return ([
  check('name', 'name is required').not().notEmpty(),
  check('phone', 'phone is required').not().notEmpty(),
  check('email', 'invalid email').isEmail(),
  check('password', 'password should be more than 6 Characters').isLength({ min: 6 })
], async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() })
  }

  const { name, phone, email, password, contacts, markedSpamNumbers } = request.body;

  try {
    let user = await User.findOne({ where: { phone: phone } });
    if (user) {
      return response.status(409).json({ error: 'user already exists' });
    }

    user = await User.create({ name, phone, email, password, contacts, markedSpamNumbers });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { phone: user.phone } };
    jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        throw err;
      }
      return response.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    return response.status(500).send('internal server error');
  }
}};

const login = (
  [check('phone', 'invalid phone').exists(), check('password', 'password is required').exists()],
  async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  const { phone, password } = request.body;

  try {
    let user = await User.findOne({ where: { phone: phone } });
    if (!user) {
      return response.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
    }

    const IsMatch = await bcrypt.compare(password, user.password);
    if(!IsMatch) {
      return response.status(400).json({ errors: [{ msg: 'invalid credentials' }] });
    }

    const payload = { user: { phone: user.phone } };
    jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        throw err;
      }
      return response.json({ token });
    });
  } 
  
  catch(err) {
    console.error(err.message);
    return response.status(500).send('internal server error');
  }
}));

module.exports = { register, login };