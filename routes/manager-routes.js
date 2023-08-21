const express = require('express');
const bodyParser = require('body-parser');
const checkAuth = require('../middlewares/check-auth');

const managerController = require('../controllers/manager-controllers');

const router = express.Router();

router.post('/signup', managerController.signup);

router.post('/create', checkAuth, managerController.createDepartment);

router.get('/read/:page', checkAuth, managerController.getAllDepartments);

router.get('/get/:departmentId', checkAuth, managerController.getDepartmentById);

router.patch('/update/:departmentId', checkAuth, managerController.updateDepartment);

router.delete('/delete/:departmentId', checkAuth, managerController.deleteDepartment);

router.get('/employees/no-department', managerController.getEmployeesWithNoDepartment);

//Get assigned employee for particular department
router.get('/assigned/:departmentId', managerController.assignedEmployeeToDepartment);

// Assign department to employee
router.post('/assign', managerController.assignDepartmentToEmployee);

module.exports = router;