var Sequelize = require('sequelize');

// Connect to the database
var sequelize = new Sequelize('mydb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;