

const Sequelize = require('sequelize');

const path = 'mysql://root:root@localhost:3306/newschema';
const sequelize = new Sequelize(path, {
    operatorsAliases: false
});

let INPUT_TYPE_MAST = sequelize.define('INPUT_TYPE_MAST', {
    input_type_name:Sequelize.STRING,
});

// INPUT_TYPE_MAST.sync().then(() => {
//     console.log('New table created');
// }).finally(() => {
//     sequelize.close();
// })

let inputTypeMasters = [
    { input_type_name: 'text' },
    { input_type_name: 'textarea' },
    { input_type_name: 'dropdrown' },
    { input_type_name: 'date' },
    { input_type_name: 'section' },
    { input_type_name: 'label' },
    { input_type_name: 'file' },
    { input_type_name: 'search' },
    { input_type_name: 'number' },
    { input_type_name: 'datalist' },
   
];

sequelize.sync({ force: true }).then(() => {
    INPUT_TYPE_MAST.bulkCreate(inputTypeMasters, { validate: true }).then(() => {
        console.log('masters created');
    }).catch((err) => {
        console.log('failed to create masters');
        console.log(err);
    }).finally(() => {
        sequelize.close();
    });
});