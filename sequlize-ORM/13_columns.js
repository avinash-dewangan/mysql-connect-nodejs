const Sequelize = require('sequelize');
const path = 'mysql://root:root@localhost:3306/newschema';
const sequelize = new Sequelize(path, {
    //operatorsAliases: false,
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