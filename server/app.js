const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));


// use res.render to load up an ejs view file

// this will give us all links page
app.get('/',
  (req, res) => {
    res.render('index');
  });

// this will give us shorten page
app.get('/create',
  (req, res) => {
    res.render('index');
  });

// will give us a page with arrays consisting objects, each object contains id and url, baseUrl, code for shortened url, title, and visits
app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.get('/login',
  (req, res) => {
    res.render('login');
  });

app.get('/signup',
  (req, res) => {
    res.render('signup');
  });


app.post('/login',
  (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var options = { username: username, password: password };

    return models.Users.get(options)
  })

app.post('/signup',
  (req, res, next) => {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var options = { username: username, password: password };
    return models.Users.get({username: username})
      .then(result => {
        // console.log('resulttttttttttt:', result);
        if (!result) {
          models.Users.create(options)
            .then(user => {
              res.redirect(200, '/');
              // res.status(200).send(user);
            });
        } else {
          res.redirect('/signup');

        }
      })
      .error(error => {
        res.status(500).send(error);
      });
    // .error(error => {
    // console.log('errorrrrrrrrr:', error);
    // models.Users.create(options)
    //   .then(user => {
    //     res.status(200).send(user);
    //   })
    //   .error(error => {
    //     res.status(500).send(error);
    //   });
    // });

  });


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
