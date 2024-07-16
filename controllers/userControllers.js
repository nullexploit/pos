const User = require("../models/User");

function getIndex(req, res) {
  res.render("index", {
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
}

function postIndex(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("failedMessage", "Please input your credentials!");
    res.redirect("/");
  } else {
    User.get(email).then((data) => {
      if (!data.email) {
        req.flash("failedMessage", "User not found!");
        res.redirect("/");
      } else {
        User.login(email, password).then((match) => {
          if (!match) {
            req.flash("failedMessage", "Your password is incorrect!");
            res.redirect("/");
          } else {
            req.session.user = {
              id: data.userid,
              email: data.email,
              name: data.name,
            };
            res.redirect("/dashboard");
          }
        });
      }
    });
  }
}

function getUser(req, res) {
  User.all().then((datas) => {
    res.render("users/users", { datas, username: req.session.user.name });
  });
}

function getAddUser(req, res) {
  res.render("users/userForm", { data: {}, username: req.session.user.name });
}

function getEditUser(req, res) {
  const id = req.params.id;
  User.getId(id).then((data) => {
    res.render("users/userForm", { data, username: req.session.user.name });
  });
}

function addUser(req, res) {
  const { email, name, password, role } = req.body;

  User.register(email, name, password, role).then(() => {
    res.redirect("/users");
  });
}

function editUser(req, res) {
  const id = req.params.id;
  const { email, name, role } = req.body;

  User.update(id, email, name, role).then(() => {
    res.redirect("/users");
  });
}

function deleteUser(req, res) {
  const id = req.params.id;
  User.del(id).then(res.redirect("/users"));
}

module.exports = {
  getIndex,
  postIndex,
  addUser,
  getEditUser,
  getUser,
  getAddUser,
  editUser,
  deleteUser,
};
