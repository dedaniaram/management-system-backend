const { DataTypes } = require('sequelize');
var db = require('../dbconfig/db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

//Manager models
const Manager = sequelize.define('Manager', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Manager