/* import { Dialect } from "sequelize";

type dialect = Dialect;

const dbConfig = {
  HOST: "localhost",
  USER: "ubuntu",
  PASSWORD: "Ubuntu@101",
  DB: "food_app_db",
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default dbConfig;
 */

import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

type dLect = Dialect;

//u302726401_ubuntu

let db: string = process.env.DB_NAME || "fooddb1";
//let dbType: dLect = "mariadb" || "mysql";

const sequelize = new Sequelize({
  database: db,
  dialect: "mariadb",
  username: process.env.DB_USER || "ubuntu",
  password: process.env.DB_PASS || "Ubuntu@101",
  host: process.env.DB_HOST || "127.0.0.1",
  //host: "192.168.56.1",
  port: 3306,
  models: [__dirname + "/models"],
  sync: { force: true },
  logging: false,
});

export default sequelize;
