import server from './server'
import { config } from 'dotenv'
import colors from 'colors'
import db from './config/db'

config()

const PORT = process.env.PORT || 3001

server.listen(PORT, async () => {
    try {
        await db.authenticate()
        console.log(colors.cyan('✅ Connected to the database'))

        await db.sync()
        console.log(colors.cyan('✅ Models synchronized'))

    } catch (err) {
        console.error('❌ Error connecting to DB:', err)
    }

    console.log(colors.green.bold(`Server is running on port ${PORT}`))
})
