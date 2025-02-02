import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();


const database = new Sequelize(process.env.DATABASE_URL!);

export default database;