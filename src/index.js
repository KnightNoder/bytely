require('dotenv').config({ path: '.env' });
require('./db/conn');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const session = require('express-session');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  })
);
app.use(favicon(path.join(__dirname, '../public/icons/logo.ico')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    if (loggedIn) {
      res.redirect('/');
    } else {
      res.render('signin', {
        isLoggedOut: !loggedIn,
        user: req.session.user,
      });
    }
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/signup', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    res.render('signup', { isLoggedOut: !loggedIn });
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/signin', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    if (loggedIn) {
      res.redirect('/');
    } else {
      res.render('signin', {
        isLoggedOut: !loggedIn,
        user: req.session.user,
      });
    }
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/logout', checkSignIn, (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    req.session.destroy((err) => {
      if (err) {
        res.render('404', {
          error: err,
          isLoggedOut: !loggedIn,
        });
      } else {
        res.redirect('/');
      }
    });
  } catch (error) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

function checkSignIn(req, res, next) {
  if (req.session.user) {
    next(); //If session exists, proceed to page
  } else {
    res.redirect('/signin'); //Error, trying to access unauthorized page!
  }
}

app.listen(PORT, () => {
  console.log(`listening to server on ${PORT}`);
});
