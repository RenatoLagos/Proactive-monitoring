import server from './server'
import { config } from 'dotenv'
import { seedRobots } from './data/seed'
import colors from 'colors'

config()

const PORT = process.env.PORT || 3001

server.listen(PORT, async () => {
    console.log(colors.green.bold(`Server is running on port ${PORT}`))
    await seedRobots()
})