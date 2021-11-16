const router = require("express").Router();
const User = require("../db").import("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateSession = require("../middleware/validate-session");

///////user signup

router.post("/signup", function (req, res) {
  User.create({
    email: req.body.user.email,
    password: bcrypt.hashSync(req.body.user.password, 13),
    usertype: req.body.user.usertype,
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
  })
    .then(function createSuccess(user) {
      let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      res.status(200).json({
        user: user,
        message: "User seccesfully created!",
        sessionToken: token,
      });
    })
    .catch((err) => res.status(500).json({error: err}));
});

/////user Login/////

router.post("/signin", (req, res) => {
  User.findOne({where: {email: req.body.user.email}}).then((user) => {
    if (user) {
      bcrypt.compare(req.body.user.password, user.password, function (
        err,
        matches
      ) {
        if (matches) {
          var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24,
          });
          res.json({
            user: user,
            message: "Successfully authenticated.",
            sessionToken: token,
          });
        } else {
          res.status(502).send({error: "Passwords do not match."});
        }
      });
    } else {
      res.status(403).send({error: "User not found."});
    }
  });
});

////User get all

router.get("/all", validateSession, (req, res) => {
  User.findAll()
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json({error: err}));
});

////User Delete

router.delete("/deleteuser/:id", validateSession, function (req, res) {
  let query;
  if (req.user.usertype == "admin") {
    query = {where: {id: req.params.id}};
  }
  User.destroy(query)
    .then(() => res.status(200).json({message: "User Removed"}))
    .catch((err) => res.status(500).json({error: err}));
});

///User Edit

router.put("/updateuser/:id", function (req, res) {
  const editveh = {
    email: req.body.user.email,
    password: bcrypt.hashSync(req.body.user.password, 13),
    usertype: req.body.user.usertype,
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
  };

  // let query;
  // if(req.user.usertype === "admin"){
  //  query = { where: { id: req.params.id } };
  // }
  const query = {where: {id: req.params.id}};

  User.update(editveh, query)
    .then((editvehicle) => res.status(200).json(editvehicle))
    .catch((err) => res.status(500).json({error: err}));
});

//userGetByID

router.get("/get/:id", function (req, res) {
  let user = req.params.id;
  User.findAll({
    where: {id: user},
  })
    .then((entry) => res.status(200).json(entry))
    .catch((err) => res.status(500).json({error: err}));
});

module.exports = router;
