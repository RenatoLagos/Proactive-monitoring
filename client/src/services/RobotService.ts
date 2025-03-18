import { safeParse } from 'valibot'
import axios from 'axios'
import { DraftRobotSchema } from "../types"

type RobotData = {
    [k: string]: FormDataEntryValue
}

export async function addRobot(data : RobotData) {
    try {
        const result = safeParse(DraftRobotSchema, {
            name: data.name
        })
        if (result.success) {
            const url = `${import.meta.env.VITE_API_URL}/api/robots`
            console.log('Sending request to:', url)
            console.log('With data:', { name: result.output.name, status: true })
            
            const response = await axios.post(url, {
                name: result.output.name,
                status: true  // Adding default status value
            })
            
            console.log('Server response:', response.data)
            return response.data
        } else {
            console.error('Validation error:', result.issues)
            throw new Error("Invalid data")
        }
    }
    catch (error) {
        console.error('Error in addRobot:', error)
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            })
        }
        throw error
    }
}