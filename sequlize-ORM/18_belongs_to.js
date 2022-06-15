const Sequelize = require('sequelize');

const path = 'mysql://root:root@localhost:3306/newschema';
const sequelize = new Sequelize(path, {
  //  operatorsAliases: false,
    logging: false
});

let Employee = sequelize.define('employees', {
    name: Sequelize.STRING
});

let Project = sequelize.define('projects', {
    name: Sequelize.STRING
});

Employee.belongsTo(Project);

let employees = [
    { name: 'Jane Brown' }, { name: 'Lucia Benner' }, { name: 'Peter Novak' }
];

sequelize.sync({ force: true }).then(() => {
    return Employee.bulkCreate(employees);
}).then((employees) => {

    let works = [];
    let i = 0;

    employees.forEach(employee => {

        let pname = 'Project ' + String.fromCharCode('A'.charCodeAt() + i);
        i++;
        
        let work = Project.create({ name: pname }).then(project => {

            employee.setProject(project);
        });

        works.push(work);

    });

    Promise.all(works).then(() => sequelize.close());
    console.log('finish');

});