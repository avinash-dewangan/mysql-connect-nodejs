const Sequelize = require('sequelize');
const path = 'mysql://root:root@localhost:3306/newschema';
const sequelize = new Sequelize(path, {
    //operatorsAliases: false,
    logging: false
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

async function deleteRow() {

    let n = await Note.destroy({ where: { id: 8 } });
    console.log(`number of deleted rows: ${n}`);

    sequelize.close();
}

deleteRow();