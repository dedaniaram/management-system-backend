const { DataTypes } = require('sequelize');
const Employee = require('../models/employee')
var db = require('../dbconfig/db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

// Define Department Models

const Department = sequelize.define('Departments', {
    department_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
    },
});

Department.associate = models => {
    Department.belongsToMany(models.Employee, { through: 'DepartmentEmployee' });
  };

module.exports = Department