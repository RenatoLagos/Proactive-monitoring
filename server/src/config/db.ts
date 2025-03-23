import { Sequelize } from "sequelize-typescript"
import dotenv from 'dotenv'
import { Robots } from '../models/Robots.model'

dotenv.config()

const database = new Sequelize(process.env.DATABASE_URL || '', {
    models: [Robots],
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf('.model')).toLowerCase() === member.toLowerCase()
    },
    logging: false
})

export default database