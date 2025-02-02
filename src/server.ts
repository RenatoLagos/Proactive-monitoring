import express from "express"
import colors from "colors"
import router from "./router"
import database from "./config/db"


// Connect to the database
async function connectDB() {
    try {
        await database.authenticate()
        database.sync()
        console.log(colors.green.bold("Connection to the database has been established successfully."))
    } catch (error) {
        console.error(colors.red.bold("Error connecting to the database: "), error)   
    }
}

connectDB()
const server = express()

server.use(express.json())

server.use('/api/robots', router)

export default server