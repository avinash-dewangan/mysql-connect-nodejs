Sequelize tutorial
last modified October 18, 2021

Sequelize tutorial shows how to program databases in JavaScript with Sequelize ORM.

Sequelize
Sequelize is a promise-based ORM for Node.js. It works with PostgreSQL, MySQL, SQLite and MSSQL dialects and features solid transaction support, relations, read replication and more.

Object Relational Mapping (ORM) is a technique of accessing a relational database from an object-oriented language.

In this tutorial we work with MySQL.

Setting up Sequelize
We initialize a Node application and install Sequelize and MySQL adapter.

$ npm init
We initiate a new Node application.

$ npm i sequelize
$ nmp i mysql2 
We install Seqelize and the MySQL driver. There are two drivers available: mysql and mysql2; we have chosen the latter.


 
Sequelize authenticate
In the first example, we create a connection to the MySQL database.

authenticate.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/testdb';
const sequelize = new Sequelize(path, { operatorsAliases: false });

sequelize.authenticate().then(() => {
  console.log('Connection established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
}).finally(() => {
  sequelize.close();
});
The example prints a message when connected to the MySQL database.

const Sequelize = require('sequelize');
We load the Sequelize module.

const path = 'mysql://user12:12user@localhost:3306/testdb';
This is the MySQL connection path. It contains the username, password, the host name, database port and database name.


 
const sequelize = new Sequelize(path, { operatorsAliases: false });
We instantiate Sequelize.

sequelize.authenticate().then(() => {
  console.log('Connection established successfully.');
...  
The authenticate method tests the connection by trying to authenticate to the database. We print a message when the connection was established OK.

}).catch(err => {
  console.error('Unable to connect to the database:', err);
...  
In case of an error, we print an error message.

}).finally(() => {
  sequelize.close();
});
In the end, we close the database connection.

$ node authenticate.js
Executing (default): SELECT 1+1 AS result
Connection established successfully
The output includes debugging ouput too.

Sequelize Model defininition
A Model represents a table in the database. Instances of this class represent a database row. The Sequelize's define method defines a new model.

define_model.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false
});

let Dummy = sequelize.define('dummy', {
    description: Sequelize.STRING
});

Dummy.sync().then(() => {
    console.log('New table created');
}).finally(() => {
    sequelize.close();
})
The example creates a simple model. It saves the model into the database table.


 
let Dummy = sequelize.define('dummy', {
    description: Sequelize.STRING
});
A new model Dummy is created. The first parameter is the model name. The second parameter consists of attributes, which are table columns. In our case we have one column name description, which is of a String type.

Dummy.sync().then(() => {
    console.log('New table created');
}).finally(() => {
    sequelize.close();
})
The sync method syncs the model to the database. In effect, it creates a new dummies table. (The table names are pluralized.)

$ node model_define.js
Executing (default): CREATE TABLE IF NOT EXISTS `dummies` (`id` INTEGER 
NOT NULL auto_increment , `description` VARCHAR(255), 
`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `dummies`
New table created
This is the output. Sequelize provides logging by default. It can be turned off with the logging option.


 
mysql> describe dummies;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| description | varchar(255) | YES  |     | NULL    |                |
| createdAt   | datetime     | NO   |     | NULL    |                |
| updatedAt   | datetime     | NO   |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)
We examine the created table in MySQL. Sequelize also created two additional columns: createdAt and updatedAt. This can be turned off with the timestamps option.

Sequelize dropping table
A table is deleted with the drop method.

drop_table.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Dummy = sequelize.define('dummy', {
    description: Sequelize.STRING
});

Dummy.drop().then(() => {
    console.log('table deleted');
}).finally(() => {
    sequelize.close();
});
The example deletes the dummies table.

Sequelize timestamps
Sequelize automatically adds timestamps to the models. We can control this behaviour with timestamps.

timestamps.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false,
    define: {
        timestamps: false
    }
});

let Dummy = sequelize.define('dummy', {
    description: Sequelize.STRING
});

sequelize.sync({force: true}).then(() => {

    Dummy.create({ description: 'test 1' }).then(() => {
        console.log('table created');
    }).finally(() => {
        sequelize.close();
    });
});
The example creates a table without the timestamps.


 
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false,
    define: {
        timestamps: false
    }
});
Here we turn off the timestamps.

mysql> describe dummies;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| description | varchar(255) | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
2 rows in set (0.00 sec)
We confirm that there are no timestamps in the table.

Sequelize bulkCreate
The bulkCreate method creates and inserts multiple instances in a bulk. The method takes an array of objects.

bulk_create_notes.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

let notes = [
    { description: 'Tai chi in the morning' },
    { description: 'Visited friend' },
    { description: 'Went to cinema' },
    { description: 'Listened to music' },
    { description: 'Watched TV all day' },
    { description: 'Walked for a hour' },
];

sequelize.sync({ force: true }).then(() => {
    Note.bulkCreate(notes, { validate: true }).then(() => {
        console.log('notes created');
    }).catch((err) => {
        console.log('failed to create notes');
        console.log(err);
    }).finally(() => {
        sequelize.close();
    });
});
The example a table notes with a few rows.

const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});
We disable logging.

sequelize.sync({ force: true }).then(() => {
The sqeuelize.syn syncs all models. The force option drops the table if it exists before the creation.

Note.bulkCreate(notes, { validate: true }).then(() => {
    console.log('notes created');
...    
The bulkCreate creates the table with six rows.

mysql> select * from notes;
+----+------------------------+---------------------+---------------------+
| id | description            | createdAt           | updatedAt           |
+----+------------------------+---------------------+---------------------+
|  1 | Tai chi in the morning | 2018-10-21 14:34:28 | 2018-10-21 14:34:28 |
|  2 | Visited friend         | 2018-10-21 14:34:28 | 2018-10-21 14:34:28 |
|  3 | Went to cinema         | 2018-10-21 14:34:28 | 2018-10-21 14:34:28 |
|  4 | Listened to music      | 2018-10-21 14:34:28 | 2018-10-21 14:34:28 |
|  5 | Watched TV all day     | 2018-10-21 14:34:28 | 2018-10-21 14:34:28 |
|  6 | Walked for a hour      | 2018-10-21 14:34:28 | 2018-10-21 14:34:28 |
+----+------------------------+---------------------+---------------------+
6 rows in set (0.00 sec)
This is the created table in the database.

Sequelize build, save
A new row is created in two steps with build and save or in one step with create.

build_save.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

const note = Note.build({ description: 'Took a cold bath' });
note.save().then(() => {
    console.log('new task saved');
}).finally(() => {
    sequelize.close();
});
The example creates a new not with build and save.

Sequelize findById
With findById, we find the specific row by its Id.

find_by_id.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';

const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

Note.findById(2).then((note) => {
    console.log(note.get({ plain: true }));
    console.log('********************')
    console.log(`id: ${note.id}, description: ${note.description}`);
}).finally(() => {
    sequelize.close();
});
The example looks for the note with Id 2.

console.log(note.get({ plain: true }));
By default Sequelize returns lots of metadata. To turn medatada off, we use the plain: true option.

$ node find_by_id.js
{ id: 2,
  description: 'Visited friend',
  createdAt: 2018-10-21T14:34:28.000Z,
  updatedAt: 2018-10-21T14:34:28.000Z }
********************
id: 2, description: Visited friend

 
We print the row twice. In the first case, we return all data. In the second case, we pick only two fields.

Sequelize findOne
The findOne method searches for a single row.

find_one.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';

const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

Note.findOne({ where: { id: 1 } }).then(note => {
    console.log(note.get({ plain: true }));
}).finally(() => {
    sequelize.close();
});
The example returns the first row from the table with find_one. The where option specifies the Id to look for.

$ node find_one.js
{ id: 1,
  description: 'Tai chi in the morning',
  createdAt: 2018-10-21T14:34:28.000Z,
  updatedAt: 2018-10-21T14:34:28.000Z }
Sequelize with async, await
In the next example, we use the async and await keywords.

find_one2.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';

const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function getOneNote() {

    let user = await Note.findOne();

    console.log(user.get('description'));
    sequelize.close();
}

getOneNote();
We return the first row with findOne using the async and await keywords.

Sequelize count
The count method counts the number of rows in the table.

count_rows.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function countRows() {

    let n = await Note.count();
    console.log(`There are ${n} rows`);
    
    sequelize.close();
}

countRows();
The example counts the number of rows in the notes table.

$ node count_rows.js
There are 7 rows
At this moment, we have seven rows in the table.

Sequelize delete row
A row is deleted with the destroy method. It returns the number of deleted rows.

delete_row.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function deleteRow() {

    let n = await Note.destroy({ where: { id: 2 } });
    console.log(`number of deleted rows: ${n}`);

    sequelize.close();
}

deleteRow();
The example deletes a row with Id 2.

Sequelize update row
A row is updated with the update method.

update_row.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function updateRow() {

    let id = await Note.update(
        { description: 'Finished reading history book' },
        { where: { id: 1 } });
    sequelize.close();
}

updateRow();
The example updates the description of the first row.

Sequelize findAll
The findAll method searches for multiple instances.

find_all.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function findAllRows() {

    let notes = await Note.findAll({ raw: true });
    console.log(notes);

    sequelize.close();
}

findAllRows();
The example retrieves all rows from the database table with findAll.

let notes = await Note.findAll({ raw: true });
The raw: true option turns off metadata.

$ node find_all.js
[ { id: 1,
    description: 'Finished reading history book',
    createdAt: 2018-10-21T14:34:28.000Z,
    updatedAt: 2018-10-21T16:00:22.000Z },
  { id: 2,
    description: 'Visited friend',
    createdAt: 2018-10-21T14:34:28.000Z,
    updatedAt: 2018-10-21T14:34:28.000Z },
  { id: 3,
    description: 'Went to cinema',
    createdAt: 2018-10-21T14:34:28.000Z,
    updatedAt: 2018-10-21T14:34:28.000Z },
  { id: 4,
    description: 'Listened to music',
    createdAt: 2018-10-21T14:34:28.000Z,
    updatedAt: 2018-10-21T14:34:28.000Z },
  { id: 5,
    description: 'Watched TV all day',
    createdAt: 2018-10-21T14:34:28.000Z,
    updatedAt: 2018-10-21T14:34:28.000Z },
  { id: 6,
    description: 'Walked for a hour',
    createdAt: 2018-10-21T14:34:28.000Z,
    updatedAt: 2018-10-21T14:34:28.000Z },
  { id: 7,
    description: 'Took a cold bath',
    createdAt: 2018-10-21T14:49:51.000Z,
    updatedAt: 2018-10-21T14:49:51.000Z } ]
The example returned seven rows.


 
Sequelize select columns
With the attributes option, we can choose which columns to include in the query.

columns.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function getTwoColumns() {

    let notes = await Note.findAll({ attributes: ['id', 'description'], raw: true });
    console.log(notes);

    sequelize.close();
}

getTwoColumns();
In the example, we select id and description columns.

$ node columns.js
Executing (default): SELECT `id`, `description` FROM `notes` AS `notes`;
[ { id: 1, description: 'Finished reading history book' },
  { id: 3, description: 'Went to cinema' },
  { id: 4, description: 'Listened to music' },
  { id: 5, description: 'Watched TV all day' },
  { id: 6, description: 'Walked for a hour' } ]
Sequelize offset, limit
With the offset and limit attributes we can define the initial skip of rows and number of rows to be included in the findAll method.

offset_limit.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function getRows() {

    let notes = await Note.findAll({ offset: 2, limit: 3, 
        attributes: ['id', 'description'], raw: true
    });
    
    console.log(notes);

    sequelize.close();
}

getRows();
The example returs three rows, starting from the second row.

$ node offset_limit.js
[ { id: 3, description: 'Went to cinema' },
  { id: 4, description: 'Listened to music' },
  { id: 5, description: 'Watched TV all day' } ]
Sequelize order by clause
To include the ORDER BY clause in the query, we use the order option.

order_by.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function getRows() {

    let notes = await Note.findAll({
        order: [['description', 'DESC']],
        attributes: ['id', 'description'], raw: true
    })

    console.log(notes);

    sequelize.close();
}

getRows();
In the example, we select all rows from the table and order them by description in descending order.

$ node order_by.js
Executing (default): SELECT `id`, `description` FROM `notes` AS `notes` 
    ORDER BY `notes`.`description` DESC;
[ { id: 3, description: 'Went to cinema'}, { id: 5, description: 'Watched TV all day' },
  { id: 6, description: 'Walked for a hour'}, { id: 2, description: 'Visited friend' },
  { id: 1, description: 'Tai chi in the morning' },
  { id: 4, description: 'Listened to music' } ]
From the output we can see that the ORDER BY clause was added to the query.

Sequelize Op.IN operator
With the Op.IN operator, we can determine whether the specified value matches any value in a subquery or a list.

operator_in.js
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function getRows() {
    
    let notes = await Note.findAll({ where: { id: { [Op.in]: [3, 6] } } });

    notes.forEach(note => {
        console.log(`${note.id}: ${note.description}`);
    });

    sequelize.close();
}

getRows();
In the example, we select all rows that match the list of ids.

$ node operator_in.js
3: Went to cinema
6: Walked for a hour
The output shows two rows: with Id 3 and 6.

Sequelize Op.between operator
With the Op.between operator, we can determine whether the specified value matches any value in the given range.

operator_between.js
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function getRows() {

    let notes = await Note.findAll({ where: { id: { [Op.between]: [3, 6] } }});

    notes.forEach(note => {
        console.log(`${note.id}: ${note.description}`);
    });
    
    sequelize.close();
}

getRows();
The example displays rows 3..6 using the Op.between operator.

Sequelize belongsTo
Sequelize belongsTo creates a one-to-one association between the source model and the provided target model. The foreign key is added on the source.

belongs_to.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
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
In the example, we have two models: Employee and Project. We create a one-to-one association between the two models with belongsTo. We add data to the models.

let Employee = sequelize.define('employees', {
    name: Sequelize.STRING
});

let Project = sequelize.define('projects', {
    name: Sequelize.STRING
});
We have two models defined.

Employee.belongsTo(Project);
We create a one-to-one assotiation between the Employee and Project models. The foreign key is generated in the Employee.

let employees = [
    { name: 'Jane Brown' }, { name: 'Lucia Benner' }, { name: 'Peter Novak' }
];
We are going to create three employees.

let works = [];
The works array is used to store generated promises.

employees.forEach(employee => {

    let pname = 'Project ' + String.fromCharCode('A'.charCodeAt() + i);
    i++;
    
    let work = Project.create({ name: pname }).then(project => {

        employee.setProject(project);
    });

    works.push(work);

});
We go through the array of employees and generate a new project for each of them. A new project is added with setProject. The Project.create generates a new promise, which is added to the works array.

Promise.all(works).then(() => sequelize.close());
The Promise.all resolves all promises in the array.

Next we retrieve the joined data. When we generate queries that also take associated data from other tables, we have eager loading. Eager loading is enabled with the include option.

belongs_to2.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Employee = sequelize.define('employees', {
    name: Sequelize.STRING
});

let Project = sequelize.define('projects', {
    name: Sequelize.STRING
});

Employee.belongsTo(Project);

Employee.findAll({include: [Project]}).then(employees => {

    employees.forEach(employee => {
        console.log(`${employee.name} is in project ${employee.project.name}`);
    });
}).finally(() => {
    sequelize.close();
});
The example lists employees and their projects.

Employee.findAll({include: [Project]}).then(employees => {
In the query, we add the include option, which includes associated model.

$ node belongs_to2.js 
Jane Brown is in project Project A
Lucia Benner is in project Project B
Peter Novak is in project Project C
Sequelize bidirectional one-to-one relationship
A bidirectional relationship is valid in both directions. We can refer from the source model to the target model and vice versa. To create a bidirectional one-to-one relationship between models, we map them with belongsTo and hasOne.

bidi_one2one.js
const Sequelize = require('sequelize');

const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let Employee = sequelize.define('employees', {
    name: Sequelize.STRING
});

let Project = sequelize.define('projects', {
    name: Sequelize.STRING
});

Employee.belongsTo(Project);
Project.hasOne(Employee);

Project.findAll({include: [Employee]}).then(projects => {

    projects.forEach(project => {
        console.log(`${project.name} belongs to user ${project.employee.name}`);
    });
}).finally(() => {
    sequelize.close();
});
In this example, we retrieve an employee from each project.

Employee.belongsTo(Project);
Project.hasOne(Employee);
In order to achieve bidirectional association, we also map the models with hasOne.

$ node bidi_one2one.js
Project A belongs to user Jane Brown
Project B belongs to user Lucia Benner
Project C belongs to user Peter Novak
Sequelize hasMany
Sequelize hasMany creates a many-to-one association between the source and the provided target. The foreign key is added on the target.

one_to_many.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let User = sequelize.define('user', {
    name: Sequelize.STRING,
});

let Task = sequelize.define('task', {
    description: Sequelize.STRING,
});

User.hasMany(Task);

async function createTables() {

    await User.sync();
    await Task.sync();

    console.log('done');
    sequelize.close();
}

createTables();
First, we create two tables: users and tasks.

In the second step, we fill tables with data.

one_to_many2.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let User = sequelize.define('user', {
    name: Sequelize.STRING
});

let Task = sequelize.define('task', {
    description: Sequelize.STRING,
});

User.hasMany(Task);

let mytasks1 = [
    { description: 'write memo' }, { description: 'check accounts' }
];

let mytasks2 = [
    { description: 'make two phone calls' },
    { description: 'read new emails' },
    { description: 'arrange meeting' }
];

async function addUsersTasks() {

    let user1 = await User.create({ name: 'John Doe' });
    let tasks1 = await Task.bulkCreate(mytasks1);

    await user1.setTasks(tasks1);

    let user2 = await User.create({ name: 'Debbie Griffin' });
    let tasks2 = await Task.bulkCreate(mytasks2);

    await user2.setTasks(tasks2);

    console.log('done');
    sequelize.close();
}

addUsersTasks();
We have two users which have some tasks.

let user1 = await User.create({ name: 'John Doe' });
A new user is created with User.create.

let tasks1 = await Task.bulkCreate(mytasks1);
New tasks are generated with Task.bulkCreate.

await user1.setTasks(tasks1);
The tasks are added to the user with setTasks.

Finally, we retrieve the data.

one_to_many3.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let User = sequelize.define('user', {
    name: Sequelize.STRING
});

let Task = sequelize.define('task', {
    description: Sequelize.STRING,
});

User.hasMany(Task);

async function showUsersTasks() {

    let users = await User.findAll({ include: [Task] });

    users.forEach(user => {

        console.log(`${user.name} has tasks: `);

        let tasks = user.tasks;

        tasks.forEach(task => {
            console.log(`  * ${task.description}`);
        })
    });

    console.log('done');
    sequelize.close();
}

showUsersTasks();
In the example, we show all users and their associated tasks.

let users = await User.findAll({ include: [Task] });
To enable eager loading, we use the include option. Eager loading is when associated data is retrieved in the query as well.

$ node one_to_many3.js
John Doe has tasks:
  * write memo  * check accountsDebbie Griffin has tasks:
  * make two phone calls  * read new emails
  * arrange meeting
done
Bidirectional one-to-many relationship
A bidirectional one-to-many relationship works in both directions. To create a bidirectional one-to-many relationship between models, we map them with hasMany and belongsTo.

bidi_one2many.js
const Sequelize = require('sequelize');
const path = 'mysql://user12:12user@localhost:3306/mydb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

let User = sequelize.define('user', {
    name: Sequelize.STRING
});

let Task = sequelize.define('task', {
    description: Sequelize.STRING
});

User.hasMany(Task);
Task.belongsTo(User);

async function showTaskUser() {

    let task = await Task.findOne({ include: [User] });

    console.log(`${task.description} belongs to ${task.user.name}`);

    sequelize.close();
}

showTaskUser();
The example gets a user from the retrieved task.

User.hasMany(Task);
Task.belongsTo(User);
To achieve a bidirectional one-to-one relationship, we map the models with hasMany and belongsTo.

$ node bidi_one2many.js
write memo belongs to John Doe
In this tutorial, we have worked with the Seqeulize library. We have created a few command line programs that interacted with MySQL.#   m y s q l - c o n n e c t - n o d e j s  
 