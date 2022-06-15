const Sequelize = require('sequelize');
const path = 'mysql://root:root@localhost:3306/newschema';
const sequelize = new Sequelize(path, {
   // operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function updateRow() {

    let id = await Note.update(
        { description: 'Finished reading history book' },
        { where: { id: 1 } });
        console.log(id)
    sequelize.close();
}

updateRow();