const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // access the cookies on the request req.cookies
  // look up the user data related to the session
  // for the user who just logged in, get the user ID
  // create new hash
  // assign an object to a session property on the req, should contain user info
  // user info - ???

  // req with no cookies


  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

