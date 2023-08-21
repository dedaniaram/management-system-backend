const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Manager = require('../models/manager');
const SECRET_KEY = 'your-secret-key';

// Login endpoint
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ where: { email } });

        if (!employee) {
            const manager = await Manager.findOne({ where: { email } });

            if (!manager) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const passwordMatch2 = await bcrypt.compare(password, manager.password);
            if (!passwordMatch2) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ userId: manager.id, email: manager.email }, SECRET_KEY);
            const role = 'manager';
            res.json({ token, role });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, employee.password);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: employee.id, email: employee.email }, SECRET_KEY);
        const role = 'employee';
        const employeeId = employee.id;
        res.json({ token, role, employeeId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = login;