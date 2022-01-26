const express = require('express');
const router = new express.Router();
const shortUrl = require('../models/shortUrl');

router.get('/', (req, res) => {
  try {
    res.send('sorry no resource found');
  } catch (error) {
    console.log(error);
  }
});

router.get('/:url', async (req, res) => {
  try {
    const url = req.params.url;
    const shortUrlVisited = await User.find({ shortUrl: url });
    shortUrlVisited.clicks++;
    res.send(shortUrlVisited);
  } catch (error) {
    console.log(error);
  }
});

router.post('/:url', async (req, res) => {
  try {
    const url = req.params.url;
    const shortUrlVisited = await User.find({ shortUrl: url });
    shortUrlVisited.clicks++;
    res.send(shortUrlVisited);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    await User.deleteOne({ name: username });
    res.status(200).send('Ok');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
