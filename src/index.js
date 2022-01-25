// require('dotenv').config({ path: '.env' });
// require('./db/conn');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');

app.use(favicon(path.join(__dirname, '../public/icons/logo.ico')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('hello');
});
app.listen(PORT, () => {
  console.log(`listening to server on ${PORT}`);
});
