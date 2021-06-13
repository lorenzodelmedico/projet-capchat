const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const privateRoute = require("./routes/privateRoute");
const passport = require("passport");
const strategyToken = require("passport-jwt");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//allow read from .env file 

const result = dotenv.config();

// console.log(result)

//mongoose connection 

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex:true
})


//configuration de bootstrap
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

//configuration des routes 
app.use("/", indexRouter);
app.use("/users", usersRouter);

//authentification a une route privee en passant le token en QUERYPARAMS
app.use("/privateRoute", passport.authenticate('jwt', {session:false}, privateRoute));


//strategy pour le token
passport.use('jwt',
  new strategyToken.Strategy(
    {
      secretOrKey : 'xxzaehoinnkiazj75za7*2s7*da6z9d7dw5',
      jwtFromRequest: strategyToken.ExtractJwt.fromUrlQueryParameter('jwt')
    },
    async(token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done (error)
      }
    }
  )
)


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
