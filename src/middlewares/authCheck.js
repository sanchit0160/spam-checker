const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware function for checking authentication using JWT
const authCheck = function(request, response, next) {
  // Extracting the token from the 'Authorization' header in the HTTP request
  const token = request.header('Authorization');

  if(!token) {
    return response.status(401).json({ msg: 'authorization denied' });
  }
  try {
    // Verifying the token using the secret key from the environment variables
    const decoded = jwt.verify(token, process.env.jwtSecret);

    // Attaching the decoded user information to the request object for further use
    request.user = decoded.user;
    next();
  } 
  catch(err) {
    response.status(401).json({ msg: 'invalid token' });
  }
};

module.exports = authCheck;