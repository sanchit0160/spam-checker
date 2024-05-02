const { Op } = require('sequelize');
const User = require('../models/User');
const Spammer = require('../models/Spammer');
const e = require('cors');

const byName = async (request, response) => {
  try {
    const { name } = request.params;

    const authUserPhone = request.user.phone;

    const authUserData = await User.findByPk(authUserPhone);
    if (!authUserData) {
      return response.status(401).send('Unauthorized');
    }

    const startsWithResults = await User.findAll({
      where: {
        name: { [Op.like]: `${name}%` },
      },
      attributes: ['name', 'phone'],
    });

    const containsResults = await User.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
      },
      attributes: ['name', 'phone'],
    });

    let results = startsWithResults.concat(
      containsResults.filter((containsResult) => {
        return !startsWithResults.some(
          (startsWithResult) => startsWithResult.name === containsResult.name
        );
      })
    );


    const resultsWithSpamLikelihood = await Promise.all(results.map(async (result) => {

      const spammer = await Spammer.findByPk(result.phone);
      const isSpam = spammer && spammer.flagsCount > 5;

      const resultPhone = result.toJSON().phone;
      let user = await User.findByPk(resultPhone, {
        attributes: ['email', 'contacts'],
      });
      let userContact = user.contacts;
    
      if (typeof userContact === 'string') {
        const dataArray = JSON.parse(userContact);
        const containsPhoneNumber = dataArray.some(contact => contact.contactPhone === authUserPhone);
        if (containsPhoneNumber) {
          console.log(user.email);
          return { ...result.toJSON(), email: user.email, isSpam };
        }
      }
      
      return { ...result.toJSON(), isSpam };
    }));

    return response.status(200).json({ results: resultsWithSpamLikelihood });
  } catch (error) {
    console.error(error);
    return response.status(500).send('internal server error');
  }
};

const byPhone = async (request, response) => {
  try {
    const { phone } = request.params;

    const authUserPhone = request.user.phone;

    const authUserData = await User.findByPk(authUserPhone);
    if (!authUserData) {
      return response.status(401).send('unauthorized');
    }

    /**
     * Phone number validation to be check is left 
     * whether the number we are getting from the 
     * request parameter is a valid number or not.
     */

    const userResult = await User.findOne({
      where: { phone: phone },
      attributes: ['name', 'phone', 'email'],
    });
    
    
    if (userResult) {
      const spammer = await Spammer.findByPk(phone);
      let isSpam;

      if (spammer && spammer.flagsCount > 5) {
        isSpam = true;
      } else {
        isSpam = false;
      }

      let userResultWithSpamLikelihood = { ...userResult.toJSON(), isSpam };
      const resultPhone = userResultWithSpamLikelihood.phone;
    
      let user = await User.findByPk(resultPhone, {
        attributes: ['contacts'],
      });
      let userContact = user.contacts;
    
      if (typeof userContact === 'string') {
        
        const dataArray = JSON.parse(userContact);
        const containsPhoneNumber = dataArray.some(contact => contact.contactPhone === authUserPhone);
        
        if (!containsPhoneNumber) {
          delete userResultWithSpamLikelihood.email;
          return response.status(200).json({ userResult: userResultWithSpamLikelihood });
        }
        return response.status(200).json({ userResult: userResultWithSpamLikelihood });
      } else {
        delete userResultWithSpamLikelihood.email;
        return response.status(200).json({ userResult: userResultWithSpamLikelihood });
      }
    }
    

    const allResults = await User.findAll({
      attributes: ['contacts'],
    });
    var filteredData = allResults.filter(entry => entry.contacts !== null);

    var parsedData = filteredData.map(entry => {
      return {
          contacts: JSON.parse(entry.contacts)
      };
    });

    var filteredContacts = parsedData.filter(entry => {
      return entry.contacts.some(contact => contact.contactPhone == phone);
    });

    const filteredContactsFlat = filteredContacts.flatMap(entry => entry.contacts);

    const resultsWithSpamLikelihood = await Promise.all(filteredContactsFlat.map(async (result) => {
        const spammer = await Spammer.findByPk(result.contactPhone);
        const isSpam = spammer && spammer.flagsCount > 5;
        return { ...result, isSpam };
    }));

    return response.status(200).json({ allResults: resultsWithSpamLikelihood });
  } catch (error) {
    console.error(error);
    return response.status(500).send('internal server error');
  }
};



module.exports = { byName, byPhone };