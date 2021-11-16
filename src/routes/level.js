const express = require('express');
const router = express.Router();

const LevelController = require('../app/controllers/LevelController');

router.get('/', LevelController.home);



module.exports = router;