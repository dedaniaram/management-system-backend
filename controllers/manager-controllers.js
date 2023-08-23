const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Manager = require('../models/manager');
const Department = require('../models/department');
const Employee = require('../models/employee');
const { where } = require('sequelize');
const SECRET_KEY = 'your-secret-key';
var db = require('../dbconfig/db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

// Signup endpoint
const signup = async (req, res) => {
    try {
        const { email, password, first_name, last_name, gender, hobbies } = req.body;
        let existingUser;

        try {
            existingUser = await Manager.findOne({ where: { email: email } });
        } catch (err) {
            return res.status(500).json({
                message: 'Signing up failed, please try again later.',
                errorCode: 500
            });
        }

        if (existingUser) {
            return res.status(422).json({
                message: 'User exists already, please login instead.',
                errorCode: 422
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                message: 'Could not create user, please try again.',
                errorCode: 500
            });
        }

        let manager;
        try {
            manager = await Manager.create({
                email,
                password: hashedPassword,
                first_name,
                last_name,
                gender,
                hobbies,
            });
        } catch (err) {
            return res.status(500).json({
                message: 'Signing up failed, please try again later.',
                errorCode: 500
            });
        }

        let token;
        try {
            token = jwt.sign({ userId: Manager.id, email: Manager.email }, SECRET_KEY);
        } catch (err) {
            return res.status(500).json({
                message: 'Signing up failed, please try again later.',
                errorCode: 500
            });
        }

        const role = 'manager';

        res.status(201).json({
            userId: manager.id,
            email: manager.email,
            token: token,
            role: role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new department

const createDepartment = async (req, res) => {
    try {
        const { department_name, category_name, location, salary } = req.body;

        // Check if the category of the department already exists
        const existingDepartment = await Department.findOne({ where: { department_name } });
        if (existingDepartment) {
            const existingCategory = await Department.findOne({ where: { category_name } });
            if (existingCategory)
                return res.status(409).json({ message: 'Category already exists' });
        }

        // Create the new department
        try {
            const newDepartment = await Department.create({
                department_name,
                category_name,
                location,
                salary,
            });
            res.status(201).json({ department: newDepartment });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Creating department failed, please try again later.',
                errorCode: 500,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve all departments
const getAllDepartments = async (req, res) => {
    try {
        const page = req.params.page || 1; // Get page from query parameter or default to 1
        const limit = 5; // Number of departments per page

        const offset = (page - 1) * limit; // Calculate the offset

        const departments = await Department.findAll({
            // include: Employee,
            offset: offset,
            limit: limit,
        });

        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Retrieve a department by ID
const getDepartmentById = async (req, res) => {
    const { departmentId } = req.params;
    try {
        const department = await Department.findByPk(departmentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
    const { departmentId } = req.params;
    const { department_name, category_name, location, salary } = req.body;
    try {
        // Check if the category of the department already exists
        const department = await Department.findByPk(departmentId);
        if (department) {
            const existingCategory = await Department.findOne({ where: { category_name } });
            if (existingCategory)
                return res.status(409).json({ message: 'Category already exists' });
        }
        department.department_name = department_name;
        department.category_name = category_name;
        department.location = location;
        department.salary = salary;
        await department.save();
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
    const { departmentId } = req.params;
    try {
        const department = await Department.findByPk(departmentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Assign the department to the employee
        const updatedRows = await Employee.update(
            { department_id: null },
            { where: { department_id: departmentId } }
        );

        await department.destroy();
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get employees with no Departments Assigned
const assignedEmployeeToDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        // Find employees for one department_id 
        const employees = await Employee.findAll({ where: { department_id: departmentId } });

        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching employees' });
    }
};

//Get employees with no Departments Assigned
const getEmployeesWithNoDepartment = async (req, res) => {
    try {
        // Find employees where department_id is null
        const employees = await Employee.findAll({ where: { department_id: null } });

        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching employees' });
    }
};



// Assign a department to an employee
const assignDepartmentToEmployee = async (req, res) => {
    try {
        const { employeeId, departmentId } = req.body;

        // Find the employee and department
        // const employee = await Employee.findByPk(employeeId);
        const department = await Department.findByPk(departmentId);

        // Check if employee and department exist
        if (!department) {
            return res.status(404).json({ message: 'Employee or department not found' });
        }

        // Assign the department to the employee
        const updatedRows = await Employee.update(
            { department_id: departmentId },
            { where: { id: employeeId } }
        );

        res.status(200).json({ message: 'Department assigned to employee successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signup,
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    assignedEmployeeToDepartment,
    getEmployeesWithNoDepartment,
    assignDepartmentToEmployee,
};

