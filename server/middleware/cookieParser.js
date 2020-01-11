const parseCookies = (req, res, next) => {
  // console.log('............', req.headers.cookie);
  // console.log('............', req.cookies, '..........');
  // console.log('***************:', req);
  var cookiesString = req.headers.cookie;

  if (cookiesString !== undefined) {
    var array = cookiesString.split('; ');
    // console.log('arrayyyyyyyyyyyyyyyy:', array);
    array.forEach(element => {
      var array2 = element.split('=');
      req.cookies[array2[0]] = array2[1];
    });
    // console.log(req.cookies);
  }

  next();

};

module.exports = parseCookies;