import express from "express"
import colors from "colors"
import cors from "cors"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import swaggerSpec, { swaggerUiOptions } from "./config/swagger"
import router from "./router"
import database from "./config/db"
import { errorHandler } from './middleware'


// Connect to the database
export async function connectDB() {
    try {
        await database.authenticate()
        await database.sync({ force: true })
        console.log(colors.green.bold("Connection to the database has been established successfully."))
    } catch (error) {
        console.error(colors.red.bold("Error connecting to the database: "), error)   
    }
}

connectDB()

// Instance of express
const server = express()

// Allow CORS
server.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:51976'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Read data from forms
server.use(express.json())

server.use(morgan('dev'))

// Test endpoint
server.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

server.use('/api/robots', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

// Error handling middleware
server.use(errorHandler)

export default server