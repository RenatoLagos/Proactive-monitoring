import express from "express"
import colors from "colors"
import cors, { CorsOptions } from "cors"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import swaggerSpec, { swaggerUiOptions } from "./config/swagger"
import router from "./router"
import database from "./config/db"


// Connect to the database
export async function connectDB() {
    try {
        await database.authenticate()
        database.sync()
        console.log(colors.green.bold("Connection to the database has been established successfully."))
    } catch (error) {
        console.error(colors.red.bold("Error connecting to the database: "), error)   
    }
}

connectDB()

// Instance of express
const server = express()

// Allow CORS
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        // Check if the origin is allowed
        if (origin === process.env.FRONTEND_URL || origin.startsWith('http://localhost')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

server.use(cors(corsOptions))

// Read data from forms
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/robots', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server