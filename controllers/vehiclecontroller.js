const express = require("express");
const router = express.Router();
const validateSession = require("../middleware/validate-session");
const Vehicle = require("../db").import("../models/vehicle");

//////Add//////

router.post("/addveh", validateSession, (req, res) => {
    const addvehicle = {
        year: req.body.vehicle.year,
        make: req.body.vehicle.make,
        model: req.body.vehicle.model,
        vin: req.body.vehicle.vin,
        price: req.body.vehicle.price,
        millage: req.body.vehicle.millage,
        color: req.body.vehicle.color,
        photo: req.body.vehicle.photo,
        condition: req.body.vehicle.condition,
        bodystyle: req.body.vehicle.bodystyle,
        status: req.body.vehicle.status,
        views: req.body.vehicle.views,
        description: req.body.vehicle.description,
        owner: req.user.id,
    };
    Vehicle.create(addvehicle)
        .then((log) => res.status(200).json(log))
        .catch((err) => res.status(500).json({ error: err }));
});

/////All////

router.get("/all", (req, res) => {

    Vehicle.findAll()
        .then((vehicle) => res.status(200).json(vehicle))
        .catch((err) => res.status(500).json({ error: err }));
});

///////Mine/////

router.get("/mine", validateSession, (req, res) => {
    let userid = req.user.id;
    Vehicle.findAll({
        where: { owner: userid },
    })
        .then((vehicle) => res.status(200).json(vehicle))
        .catch((err) => res.status(500).json({ error: err }));
});

//////Update/////

router.put("/editveh/:id", validateSession, function (req, res) {
    const editveh = {
        year: req.body.vehicle.year,
        make: req.body.vehicle.make,
        model: req.body.vehicle.model,
        vin: req.body.vehicle.vin,
        price: req.body.vehicle.price,
        millage: req.body.vehicle.millage,
        color: req.body.vehicle.color,
        photo: req.body.vehicle.photo,
        condition: req.body.vehicle.condition,
        bodystyle: req.body.vehicle.bodystyle,
        status: req.body.vehicle.status,
        views: req.body.vehicle.views,
        description: req.body.vehicle.description,
    };

    const query = { where: { id: req.params.id, owner: req.user.id } };

    Vehicle.update(editveh, query)
        .then((editvehicle) => res.status(200).json(editvehicle))
        .catch((err) => res.status(500).json({ error: err }));
});

//update views//

router.put("/editviews/:id", function (req, res) {
    const editveh = {
        year: req.body.vehicle.year,
        make: req.body.vehicle.make,
        model: req.body.vehicle.model,
        vin: req.body.vehicle.vin,
        price: req.body.vehicle.price,
        millage: req.body.vehicle.millage,
        color: req.body.vehicle.color,
        photo: req.body.vehicle.photo,
        condition: req.body.vehicle.condition,
        bodystyle: req.body.vehicle.bodystyle,
        status: req.body.vehicle.status,
        views: req.body.vehicle.views,
        description: req.body.vehicle.description,
    };

    const query = { where: { id: req.params.id } };

    Vehicle.update(editveh, query)
        .then((editvehicle) => res.status(200).json(editvehicle))
        .catch((err) => res.status(500).json({ error: err }));
});

//Delete//

router.delete("/delveh/:id", validateSession, function (req, res) {
    const query = { where: { id: req.params.id, owner: req.user.id } };

    Vehicle.destroy(query)
        .then(() => res.status(200).json({ message: "Vehicle Removed" }))
        .catch((err) => res.status(500).json({ error: err }));
});

//Get by id//

router.get("/get/:id", function (req, res) {
    let vehicle = req.params.id;
    Vehicle.findAll({
        where: { id: vehicle },
    })
        .then((entry) => res.status(200).json(entry))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;