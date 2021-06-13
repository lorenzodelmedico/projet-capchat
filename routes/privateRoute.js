const express = require("express");
const router = express.Router();

/* GET privateRoute */
//ne fonctionne pas => manque de temps 
//l'idée est de permettre l'acces a cette route seulement si l'utilisateur dispose d'un token valide (dans le code ci-dessous, on regarde s'il existe dans les query params)
router.get("/", function (req, res, next) {
  res.render(
    'connected',
    {
      username: req.user,
      title:'Espace privé',
      token: req.query.jwt
    }
  )
});



module.exports = router;
