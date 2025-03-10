import express from "express"
import colors from "colors"
import swaggerUi from "swagger-ui-express"
import swaggerSpec, { swaggerUiOptions } from "./config/swagger"
import router from "./router"
import database from "./config/db"


// Connect to the database
export async function connectDB() {
    try {
        await database.authenticate()
        database.sync()
        // console.log(colors.green.bold("Connection to the database has been established successfully."))
    } catch (error) {
        console.error(colors.red.bold("Error connecting to the database: "), error)   
    }
}

connectDB()

// Instance of express
const server = express()

// Read data from forms
server.use(express.json())

server.use('/api/robots', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server