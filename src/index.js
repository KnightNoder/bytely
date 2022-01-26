require('dotenv').config({ path: '.env' });
require('./db/conn');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const session = require('express-session');
const userRouter = require('./routers/users');
const User = require('../src/models/user');
const shortUrlRouter = require('./routers/shortUrls');
const bcrypt = require('bcrypt');
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/byte', shortUrlRouter);

app.get('/', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    if (loggedIn) {
      res.redirect('/dashboard');
    } else {
      res.render('signin', {
        isLoggedOut: !loggedIn,
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

app.post('/signup', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    if (loggedIn) {
      res.redirect('/dashboard');
    } else {
      const password = req.body.password;
      const cn_password = req.body.cnf_password;
      if (cn_password === password) {
        const newUser = new User({
          name: req.body.username,
          password: req.body.password,
        });
        const saveUser = await newUser.save();
        res.redirect('/');
      } else {
        res.render('404', {
          error: 'Error:Passwords are not matching',
          isLoggedOut: !loggedIn,
        });
      }
    }
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.post('/signin', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });
    if (Object.keys(user).length) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('404', {
          error: 'Invalid password',
          isLoggedOut: !loggedIn,
        });
      }
    }
  } catch (err) {
    res.render('404', {
      error: 'Invalid username',
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/logout', (req, res) => {
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

app.get('/home', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  res.render('home', { isLoggedOut: !loggedIn });
});

app.get('/dashboard', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  res.render('dashboard', { isLoggedOut: !loggedIn });
});

app.use('*', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  res.render('404', {
    error: 'Page not found',
  });
});

function checkSignIn(req, res, next) {
  const loggedIn = req.session.user ? true : false;
  if (req.session.user) {
    next();
  } else {
    res.redirect('/dashboard');
  }
}

app.listen(PORT, () => {
  console.log(`listening to server on ${PORT}`);
});
