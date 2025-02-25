import { connectDB } from '../server'
import db from '../config/db'


// Mocking the database connection
jest.mock('../config/db')

describe('ConnectDB', () => {
    it('should handle database connection error', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Connection failed'))
        const consoleSpy = jest.spyOn(console, 'error')
        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith('Error connecting to the database: ', new Error('Connection failed'))
    })
})
