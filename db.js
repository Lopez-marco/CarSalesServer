const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false, // very important
    //       }
    //   }
})
//update
sequelize.authenticate().then(
    function () {
        console.log('Connected');
    },
    function (err) {
        console.log(err);
    }
);
module.exports = sequelize


////pg updated to 8.0.3 to make it Work