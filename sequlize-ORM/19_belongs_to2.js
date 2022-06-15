const Sequelize = require('sequelize');

const path = 'mysql://root:root@localhost:3306/newschema';
const sequelize = new Sequelize(path, {
   // operatorsAliases: false,
    logging: false
});

let Employee = sequelize.define('employees', {
    name: Sequelize.STRING
});

let Project = sequelize.define('projects', {
    name: Sequelize.STRING
});
Employee.sync().then(() => {
    console.log('New table created');
}).finally(() => {
    sequelize.close();
})
Project.sync().then(() => {
    console.log('New table created');
}).finally(() => {
    sequelize.close();
})
Employee.belongsTo(Project);

Employee.findAll({include: [Project]}).then(employees => {

    employees.forEach(employee => {
        console.log(`${employee.name} is in project ${employee.project.name}`);
    });
}).finally(() => {
    sequelize.close();
});