const express = require('express');
const bodyParser = require('body-parser');
const checkAuth = require('../middlewares/check-auth');

const employeesController = require('../controllers/employee-controllers');

const router = express.Router();

router.post('/signup', employeesController.signup);

router.get('/dashboard/:employeeId', employeesController.getEmployeesByDepartment,);

module.exports = router;