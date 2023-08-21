const { DataTypes } = require('sequelize');
const Employee = require('./employee');
const Department = require('./department');

var db = require('../dbconfig/db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

// Define Department Models

const DepartmentEmployee = sequelize.define('DepartmentEmployee', {
    // No additional fields needed, this table will store associations
});

// Model Associations
// Employee - Department Association
Employee.belongsTo(DepartmentEmployee); // An employee belongs to one department

// Department - Employee Association
DepartmentEmployee.hasMany(Department); // A department has many employees


module.exports = DepartmentEmployee