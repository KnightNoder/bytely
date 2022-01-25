const mongoose = require('mongoose');
const DB_URL =
  process.env.NODE_ENV === 'prod'
    ? `${process.env.PROD_DB_URL}`
    : `${process.env.DEV_DB_URL}`;

console.log(process.env.NODE_ENV, 'process.env.node_env');
console.log(DB_URL, 'db url');
mongoose
  .connect(`${DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connection successful');
  })
  .catch(() => {
    console.log('no connection');
  });
