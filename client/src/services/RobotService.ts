import { safeParse } from 'valibot'
import axios from 'axios'
import { DraftRobotSchema, RobotSchema, RobotsSchema, Robot} from "../types"

type RobotData = {
    [k: string]: FormDataEntryValue
}

export async function addRobot(data : RobotData) {
    try {
        const result = safeParse(DraftRobotSchema, {
            name: data.name,
            status: true  
        })
        if (result.success) {
            const url = `${import.meta.env.VITE_API_URL}/api/robots`
            console.log('Sending request to:', url)
            console.log('With data:', { name: result.output.name, status: result.output.status })
            
            const response = await axios.post(url, {
                name: result.output.name,
                status: result.output.status
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

export async function getRobots() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/robots`
        const { data } = await axios.get(url)
        const result = safeParse(RobotsSchema, data.data)
        if (result.success) {
            return result.output
        } else {
            console.error('Validation error:', result.issues)
            throw new Error("Invalid data")
        }
    } catch (error) {
        console.error('Error in getRobots:', error)
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

export async function getRobotById(id: Robot['id']) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/robots/${id}`
        const { data } = await axios.get(url)
        const result = safeParse(RobotSchema, data.data)    
        if (result.success) {
            return result.output
        } else {
            console.error('Validation error:', result.issues)
            throw new Error("Invalid data")
        }
    } catch (error) {
        console.error('Error in getRobotById:', error)
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