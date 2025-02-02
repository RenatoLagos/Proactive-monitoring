import { Sequelize } from "sequelize-typescript"
import dotenv from 'dotenv'
dotenv.config()


const database = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + '/../models/**/*.ts']
})

export default database