import { ActionFunctionArgs, redirect } from 'react-router-dom'
import { addRobot, updateRobot, deleteRobot, updateStatus } from '../services/RobotService'

export async function newRobotAction({ request }: ActionFunctionArgs) {
    try {
        const data = Object.fromEntries(await request.formData())
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

 export async function editRobotAction({request, params}: ActionFunctionArgs) {
    try {
        const data = Object.fromEntries(await request.formData())
        let error = ''
        
        if (Object.values(data).includes('')) {
            error = 'Please fill out all fields'
        }
        if (error.length > 0) {
            return error
        }

        if (params.id !== undefined) {
            await updateRobot(data, Number(params.id))
        }
        return redirect('/')
    } catch (error) {
        console.error('Error in action function:', error)
        return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
}

export async function deleteRobotAction({ params }: ActionFunctionArgs) {
    try {
        if (params.id !== undefined) {
            await deleteRobot(Number(params.id))
            return redirect('/')
        }
    } catch (error) {
        console.error('Error in action function:', error)
        return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
}

export async function updateRobotStatus({ request }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData())
    await updateStatus(Number(data.id))
    return {}
}   
