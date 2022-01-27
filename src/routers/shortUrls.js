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
    const base = process.env.BASE;
    const sUrl = `${base}/${url}`;
    const shortUrlVisited = await ShortUrl.findOne({ smallUrl: sUrl });
    shortUrlVisited.clicks++;
    await shortUrlVisited.save();
    const index = req.session.user.urls.findIndex((x) => x.smallUrl == sUrl);
    req.session.user.urls[index].clicks++;
    const urlsWithClicks = req.session.user.urls;
    const user = await User.findOneAndUpdate(
      { name: req.session.user.name },
      { urls: urlsWithClicks }
    );
    res.redirect(shortUrlVisited.longUrl);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  const { origUrl } = req.body;
  const base = process.env.BASE;
  const urlId = shortid.generate();
  try {
    let url = await ShortUrl.findOne({ longUrl: origUrl });
    if (url) {
      res.redirect('/dashboard');
    } else {
      const sUrl = `${base}/${urlId}`;
      let oldArray = req.session.user.urls;
      oldArray.push({
        longUrl: origUrl,
        smallUrl: sUrl,
      });
      const url = new ShortUrl({
        longUrl: origUrl,
        smallUrl: sUrl,
        clicks: 0,
      });
      await User.findOneAndUpdate(
        {
          name: req.session.user.name,
        },
        { urls: oldArray }
      );
      await url.save();
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
});

router.delete('/:url', async (req, res) => {
  try {
    const url = req.params.url;
    const base = process.env.BASE;
    const sUrl = `${base}/${url}`;
    const resp = await ShortUrl.deleteOne({ smallUrl: sUrl });
    const user = req.session.user;
    const deleteIndex = user.urls.findIndex((x) => x.smallUrl == sUrl);
    const delUser = user.urls.splice(deleteIndex, 1);
    await User.findOneAndUpdate({ name: user.name }, { urls: user.urls });
    res.send('delete success');
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
