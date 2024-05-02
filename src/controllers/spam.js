const User = require('../models/User');
const Spammer = require('../models/Spammer');
const { validationResult } = require('express-validator');

const markSpam = async (request, response) => {
  try {
    const { phone } = request.body;
    const authUserPhone = request.user.phone;

    const authUserData = await User.findByPk(authUserPhone);
    if (!authUserData) {
      return response.status(401).send('unauthorized');
    }

    if (authUserData.markedSpamNumbers && JSON.parse(authUserData.markedSpamNumbers).includes(phone)) {
      return response.status(400).json({ success: false, message: 'number is already marked as spam by the user' });
    }

    const existingMarkedSpamNumbers = JSON.parse(authUserData.markedSpamNumbers || '[]');

    existingMarkedSpamNumbers.push(phone);

    await authUserData.update({
      markedSpamNumbers: JSON.stringify(existingMarkedSpamNumbers),
    });

    let spammer = await Spammer.findByPk(phone);

    if (spammer) {
      await spammer.increment('flagsCount');
    } else {
      await Spammer.create({ phone, flagsCount: 1 });
    }


    return response.status(200).json({ success: true, message: 'number marked as spam successfully' });
  } catch (error) {
    console.error(error);
    return response.status(500).send('internal server error');
  }
};

const unmarkSpam = async (request, response) => {
  try {
    const { phone } = request.body;
    const authUserPhone = request.user.phone;

    const authUserData = await User.findByPk(authUserPhone);
    if (!authUserData) {
      return response.status(401).send('Unauthorized');
    }

    if (!(authUserData.markedSpamNumbers && JSON.parse(authUserData.markedSpamNumbers).includes(phone))) {
      return response.status(400).json({ success: false, message: 'number is not marked as spam by the user' });
    }

    await authUserData.update({
      markedSpamNumbers: JSON.stringify(
        JSON.parse(authUserData.markedSpamNumbers).filter((num) => num !== phone)
      ),
    });

    let spammer = await Spammer.findByPk(phone);

    if (spammer && spammer.flagsCount > 0) {
      await spammer.decrement('flagsCount');
    }

    return response.status(200).json({ success: true, message: 'number unmarked as spam successfully' });
  } catch (error) {
    console.error(error);
    return response.status(500).send('internal server error');
  }
};

const isSpam = async (request, response) => {
  try {
    const { phone } = request.params;
    const authUserPhone = request.user.phone;

    const authUserData = await User.findByPk(authUserPhone);
    if (!authUserData) {
      return response.status(401).send('Unauthorized');
    }

    const spammer = await Spammer.findByPk(phone);

    if (spammer && spammer.flagsCount > 5) {
      return response.status(200).json({ isSpam: true });
    } else {
      return response.status(200).json({ isSpam: false });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).send('internal server error');
  }
};

module.exports = { markSpam, unmarkSpam, isSpam };