import {Dialect, Sequelize} from 'sequelize';
const Config = require("../config/db_config");
const sequelize = new Sequelize(Config.default.database, Config.default.username, Config.default.password, {
    logging: false,
    host: Config.default.host,
    dialect: Config.default.dialect as Dialect,
    timezone: "+05:30"
})

const startDbServer = async () => {
    console.log("DB Server Staring...")
    try {
        await sequelize.authenticate();
        console.log("DB Server Started...")
    }catch(err) {
        console.log("Error While Starting Server...");
        throw err;
    }
}

export {sequelize, Sequelize, startDbServer};