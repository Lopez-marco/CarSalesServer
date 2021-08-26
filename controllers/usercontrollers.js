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
    })
        .then(function createSuccess(user) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24,
            });
            res.status(200).json({
                user: user,
                message: "User seccesfully created!",
                sessionToken: token,
            });
        }
        )
        .catch((err) => res.status(500).json({ error: err })
        );
});


/////user Login/////

router.post("/signin", (req, res) => {
    User.findOne({ where: { email: req.body.user.email } }).then((user) => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.password, function (
                err,
                matches
            ) {
                if (matches) {
                    var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                        expiresIn: 60 * 60 * 24,
                    });
                    res.json({
                        user: user,
                        message: "Successfully authenticated.",
                        sessionToken: token,
                    });
                } else {
                    res.status(502).send({ error: "Passwords do not match." });
                }
            });
        } else {
            res.status(403).send({ error: "User not found." });
        }
    });
});

router.get("/all", validateSession, (req, res) => {

    User.findAll()
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
