const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Department = require('../models/department');
const SECRET_KEY = 'your-secret-key';


// Signup endpoint
const signup = async (req, res) => {
    try {
        const { email, password, first_name, last_name, gender, hobbies } = req.body;
        let existingUser;

        try {
            existingUser = await Employee.findOne({ where: { email: email } });
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

        let employee;
        try {
            employee = await Employee.create({
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
            token = jwt.sign({ userId: Employee.id, email: Employee.email }, SECRET_KEY);
        } catch (err) {
            return res.status(500).json({
                message: 'Signing up failed, please try again later.',
                errorCode: 500
            });
        }
        const role = 'employee';

        res.status(201).json({
            employeeId: employee.id,
            email: employee.email,
            token: token,
            role: role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get employees with particular Departments
const getEmployeesByDepartment = async (req, res) => {
    try {
        const { employeeId } = req.params; // Assuming "departmentId" is the parameter

        // Find employees with the given department_id
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'No employees found' });
        }

        if (employee.department_id) {
            const department = await Department.findByPk(employee.department_id);
            // employee.department=department;
            return res.status(200).json({ success: true, department, employee });

        }
        res.status(200).json({ success: true, employee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching employees', error })
    }
};

exports.signup = signup;
exports.getEmployeesByDepartment = getEmployeesByDepartment;