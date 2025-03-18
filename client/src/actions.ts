import { ActionFunctionArgs, redirect } from 'react-router-dom'
import { addRobot } from './services/RobotService'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = Object.fromEntries(await request.formData())
        console.log('Form data received:', data)
        
        let error = ''
        
        if (Object.values(data).includes('')) {
            error = 'Please fill out all fields'
        }
        if (error.length > 0) {
            return error
        }

        await addRobot(data)
        return redirect('/')
    } catch (error) {
        console.error('Error in action function:', error)
        return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
}