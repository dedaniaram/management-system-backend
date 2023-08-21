const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 4000;
const employeeRoutes = require('./routes/employee-routes');
const managerRoutes = require('./routes/manager-routes');
const Controller = require('./controllers/common-controllers');

var db = require('./dbconfig/db'),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Allowing Cross Origin data transfer
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/employee', employeeRoutes);
app.use('/manager', managerRoutes);
app.post('/login', Controller.login);

// Query employees in IT department with location starting from 'A'
app.get('/api/query', async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: {
                model: Department,
                where: {
                    category_name: 'IT',
                    location: {
                        [Sequelize.Op.like]: 'A%',
                    },
                },
            },
            attributes: ['first_name', 'last_name'],
            order: [['first_name', 'DESC']],
        });

        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


