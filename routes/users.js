const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST user connection */
router.post('/connection', function(req, res, next) {
  console.log(req.body)
  const token = require('crypto').randomBytes(64).toString('hex');
  process.env.token = token;

});

/* POST user connection */
router.post('/register', function(req, res, next) {
  console.log(req.body)
  const token = require('crypto').randomBytes(64).toString('hex');
  process.env.token = token;

});

/* GET create account*/
router.get('/createaccount', function(req, res, next) {
    
  res.render('register.ejs', { title: 'Création de compte'});
});


/* POST artiste createur */
router.post('/register', function(req, res, next) {
  console.log(req.body)
  const token = require('crypto').randomBytes(64).toString('hex');
  process.env.token = token;

});


/* PUT artiste createur */
router.post('/register', function(req, res, next) {
  console.log(req.body)
  const token = require('crypto').randomBytes(64).toString('hex');
  process.env.token = token;

});


/* DELETE artiste createur */
router.post('/register', function(req, res, next) {
  console.log(req.body)
  const token = require('crypto').randomBytes(64).toString('hex');
  process.env.token = token;

});

module.exports = router;
