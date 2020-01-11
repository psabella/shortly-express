const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // access the cookies on the request req.cookies
  req.session = {};
  console.log('req...........', req);
  if (Object.keys(req.cookies).length === 0) {
    // req.session.hash = 0;
    models.Sessions.create()
      .then(result => {
        if (result) {
          var id = result.insertId;
          models.Sessions.get({id})
            .then(result => {
              if (result) {
                // console.log('session result: ', result);
                req.session.hash = result.hash;
                // console.log('req.session.........', req.session);
                // console.log('res.cookieeeeeeeeee:', res.cookie)
                res.cookie('shortlyid', {value: result.hash});
                next();
              }
            });
        }
      });
  } else {
    console.log('cookieeeeeeeeeeeereq:', req.cookies);
    var hash = req.cookies.shortlyid.value;
    models.Sessions.get({hash: hash})
      .then(result => {
        if (!result) {
          // req.session.hash = result.hash;
        } else {

        }
      })
    next();
  }
  // look up the user data related to the session
  // for the user who just logged in, get the user ID
  // create new hash
  // assign an object to a session property on the req, should contain user info
  // user info - ???
  // req with no cookies
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

