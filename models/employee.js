const { DataTypes } = require('sequelize');
const Department = require('../models/department')
var db = require('../dbconfig/db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

// Define Employee and Department and  Manager models
const Employee = sequelize.define('Employee', {
    department_id: {
        type: DataTypes.INTEGER, // Assuming department_id is of type INTEGER
        references: {
            model: Department,
            key: 'id', // Assuming 'id' is the primary key of the Department model
        },
    },
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
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
    },
    hobbies: {
        type: DataTypes.TEXT,
    },
});


// Employee - Department Association
Employee.associate = (models) => {
    Employee.belongsTo(models.Department, { foreignKey: 'department_id' });
};

module.exports = Employee