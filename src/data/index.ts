import { exit } from 'node:process'
import db from '../config/db'


// Connect to the database 
const clearDB = async () => {
    try {
        await db.sync({force: true})
        console.log("Database cleared successfully")
        exit()
    } catch (error) {
        console.error("Error clearing the database: ", error)
        exit(1)
    }
}

if (process.argv[2] === "--clear") {
    clearDB()
    console.log("Clearing the database...")
}