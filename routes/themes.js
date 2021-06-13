const express = require('express');
const router = express.Router();
const fs = require('fs')

/* GET themes listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });