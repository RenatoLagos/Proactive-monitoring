import { LoaderFunctionArgs, redirect } from 'react-router-dom'
import { getRobotById, getRobots } from '../services/RobotService'

export async function robotsLoader() {
    const robots = await getRobots()
    return robots
}

export async function editRobotLoader({ params }: LoaderFunctionArgs) {
    if (params.id !== undefined) {
        const robot = await getRobotById(Number(params.id))
        if (!robot) {
            return redirect('/robots')
        }
        return robot
    }
} 