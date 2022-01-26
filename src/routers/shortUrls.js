const express = require('express');
const router = new express.Router();
const ShortUrl = require('../models/shortUrl');
const User = require('../models/user');
const shortid = require('shortid');

router.get('/', (req, res) => {
  try {
    res.send('sorry no resource found');
  } catch (error) {
    res.send(error);
  }
});

router.get('/:url', async (req, res) => {
  try {
    const url = req.params.url;
    const shortUrlVisited = await shortUrl.find({ smallUrl: url });
    shortUrlVisited.clicks++;
    await shortUrlVisited.save();
    res.redirect(shortUrlVisited.longUrl);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  console.log('in post');
  const { origUrl } = req.body;
  const base = process.env.BASE;
  const urlId = shortid.generate();
  console.log(req.session, 'req session');
  try {
    let url = await ShortUrl.findOne({ longUrl: origUrl });
    if (url) {
      res.send(url.smallUrl);
    } else {
      const sUrl = `${base}/${urlId}`;
      const user = await User.findOne({ name: req.session.user.name });
      console.log(user, 'user');
      user.urls.push({
        smallUrl: sUrl,
        longUrl: origUrl,
      });
      console.log(origUrl, 'long url');
      const url = new ShortUrl({
        longUrl: origUrl,
        smallUrl: sUrl,
        clicks: 0,
      });
      await user.save();
      console.log(user, 'user');
      await url.save();
      console.log(user.urls, 'urls');
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
});

router.delete('/:url', async (req, res) => {
  try {
    const username = req.params.username;
    await shortUrl.deleteOne({ shortUrl: url });
    res.status(200).send('Ok');
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
