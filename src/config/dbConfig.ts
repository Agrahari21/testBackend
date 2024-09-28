
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";


const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mariadb",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST, 
  port: 3306,
  models: [__dirname + "/models"],
  sync: { force: true },
  logging: false,
});

export default sequelize;
