//renvoit vers le formulaire EJS de sign up 
exports.createAccount = (req, res, next) => {
  res.render("register.ejs", { title: "Création de compte" });
};
