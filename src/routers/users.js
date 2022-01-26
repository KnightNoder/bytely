const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.get('/users', async (req, res) => {
  try {
    const userList = await User.find({});
    res.send(userList);
  } catch (error) {
    res.send(error);
  }
});

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.find({ name: username });
    res.send(user, 'user found');
    return user;
    // res.render('index', { user: user[0].name });
  } catch (error) {
    res.send(error);
  }
});

router.put('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOneAndUpdate({ name: username }, req.body);
    res.send(user.password);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    res.send('in post users');
    const newUser = new User(req.body);
    const addingUser = await newUser.save();
    res.send(addingUser);
  } catch (error) {
    res.send(error);
  }
});

router.delete('/:username', async (req, res) => {
  try {
    const username = req.params.username;
    await User.deleteOne({ name: username });
    res.status(200).send('Ok');
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
