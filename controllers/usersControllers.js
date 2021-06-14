//renvoit vers le formulaire EJS de sign up 
exports.createAccount = (req, res, next) => {
  res.render("register.ejs", { title: "Création de compte" });
};

//renvoit vers le formulaire EJS de sign in
exports.signin = (req, res, next) => {
  res.render("login.ejs", { title: "Login" });
};


//apres connexion permet l'acces à la page d'upload image
exports.uploadImage = (req, res, next) => {
  res.render("upload.ejs", { title: "Importer des images" });
};
