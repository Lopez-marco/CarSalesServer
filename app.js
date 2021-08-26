require("dotenv").config();
let express = require("express");
let app = express();
const sequelize = require("./db");

let vehicle = require("./controllers/vehiclecontroller");
let user = require("./controllers/usercontrollers");

sequelize.sync();
app.use(require("./middleware/header"));
app.use(express.json());
app.use("/user", user);
app.use("/vehicle", vehicle);
app.listen(process.env.PORT, function () {
    console.log("App is Listenig on port 3000");
});
