const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

//utilisation de controller pour respecter l'architecture MVC
const userControllers = require("../controllers/usersControllers");

//utilisation de mongoose pour gerer la base de donnée MongoDB
const mongoose = require("mongoose");

//utilisation de bcrypt pour hasher le password de l'utilisateur en bdd
const bcrypt = require("bcrypt");

//utilisation de passport et passport local pour l'authentification

const passport = require("passport");
const strategy = require("passport-local");


// declare User Model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

// Avant enregistrement dans le DB on hash le password

UserSchema.pre("save", async function (next) {
  const user = this;

  const hash = await bcrypt.hash(user.password, 10);

  user.password = hash;

  next();
});

//methode du schema pour verifier le mot de passe

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const isEqual = await bcrypt.compare(password, user.password);

  return isEqual; // true || false
};

const User = mongoose.model("User", UserSchema);

/* GET create account*/
router.get("/createaccount", userControllers.createAccount);

// gestion de l'authentification

// creation de compte
passport.use(
  "register",
  new strategy.Strategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.create({ username, password });

        if (!user){
          return done(null, false, {message: "L'email est déjà existant"})
        }

        return done(null, user);
        //si erreur on null et on l'affichage en log

      } catch (error) {
        console.log(error)
        return done(error)
      }
    }
  )
);

// authentification d'un compte 

passport.use(
  "login",
  new strategy.Strategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        //si l'utilisateur n'est pas trouve dans la bdd
        if(!user){
          return done(null, false, {message: "Utilisateur non trouvé."})
        }

        const validate = await user.isValidPassword(password)

        //si le mot de passe est incorrect
        if(!validate){
          return done(null, false, {message: "Erreur de connexion."}) //on affiche un message peu clair afin d'éviter d'aider une personne malveillante
        }

        return done(null, user, {message: 'Connexion Réussie'});
      } catch (error) {
        console.log(error)
        return done(error);
      }
    }
  )
);

//POST de creation de compte

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res, next) => {
    res.redirect('/?user='+req.user)
  }
);

//gere la deconnexion 
//ne fonctionne pas reellement etant donne qu'on ne sauvegarde pas la session de l'utilisateur, dans un systeme qui fonctionne on supprimerai le token de l'utilisateur
router.post(
  "/logout", (req, res, next) => {
    res.redirect('/')
  }
)

//POST d'authentification

router.post(
  "/login", (req, res, next) => {
    passport.authenticate("login", async (err, user) => {
      try{
        if (err || !user){
          const error = new Error('Une erreur est survenue.')
          return next(error)
        }
        req.login(user, { session:false}, async error => {
          if(error) return next(error)
          const body = {id: user._id, email:user.email}
          const payload = {id: user._id}
          const token = jwt.sign({user: body}, 'xxzaehoinnkiazj75za7*2s7*da6z9d7dw5');
          // res.redirect('/privateRoute?jwt='+token)
          // alert("token pour accès privé = "+token)
          res.redirect('/?user='+user.email)
        })
      } catch (error) {
        return next(error);
      }
    })(req, res ,next) //rappel de la fonction
  }
);


module.exports = router;

// /* POST artiste createur */
// router.post('/register', function(req, res, next) {
//   console.log(req.body)
//   const token = require('crypto').randomBytes(64).toString('hex');
//   process.env.token = token;

// });

// /* PUT artiste createur */
// router.post('/register', function(req, res, next) {
//   console.log(req.body)
//   const token = require('crypto').randomBytes(64).toString('hex');
//   process.env.token = token;

// });

// /* DELETE artiste createur */
// router.post('/register', function(req, res, next) {
//   console.log(req.body)
//   const token = require('crypto').randomBytes(64).toString('hex');
//   process.env.token = token;

// });

/* POST new user */
// router.post('/register', async (req, res, next) => {
//   const user = new User(req.body)
//   try{
//       await user.save()
//       res.send(user)
//   } catch(err) {
//       next(err)
//   }
// });
