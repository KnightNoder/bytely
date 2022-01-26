const express = require('express');
const router = new express.Router();
const shortUrl = require('../models/shortUrl');

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
    const shortUrlVisited = await shortUrl.find({ shortUrl: url });
    shortUrlVisited.clicks++;
    res.send(shortUrlVisited);
  } catch (error) {
    res.send(error);
  }
});

router.post('/:url', async (req, res) => {
  try {
    const url = req.params.url;
    const shortUrlVisited = await shortUrl.find({ shortUrl: url });
    shortUrlVisited.clicks++;
    res.send(shortUrlVisited);
  } catch (error) {
    res.send(error);
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
