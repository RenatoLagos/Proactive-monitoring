import { Request, Response, NextFunction, RequestHandler } from 'express'
import Robots, { AlertType } from '../models/Robots.model'

// Get all robots
export const getRobots: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robots = await Robots.findAll({
            order: [['id', 'ASC']]
        })
        
        if (!robots) {
            res.status(404).json({
                success: false,
                message: "No robots found"
            })
            return
        }

        res.status(200).json({
            success: true,
            data: robots
        })
    } catch (error) {
        next(error)
    }
}

// Get a single robot
export const getRobotById: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({
                success: false,
                message: "Robot not found"
            })
            return
        }

        res.status(200).json({
            success: true,
            data: robot
        })
    } catch (error){
        next(error)
    }
}

// Create a new robot
export const createRobots: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robot = await Robots.create(req.body)
        res.status(201).json({
            success: true,
            data: robot
        })
    } catch (error) {
        next(error)
    }
}

// Update a robot
export const updateRobot: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({
                success: false,
                message: "Robot not found"
            })
            return
        }

        await robot.update(req.body)
        res.status(200).json({
            success: true,
            data: robot
        })
    } catch (error) {
        next(error)
    }
}

// Update robot status
export const updateRobotStatus: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({
                success: false,
                message: "Robot not found"
            })
            return
        }

        await robot.update({ status: !robot.status })
        res.status(200).json({
            success: true,
            data: robot
        })
    } catch (error) {
        next(error)
    }
}

// Update robot alert
export const updateRobotAlert: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({
                success: false,
                message: "Robot not found"
            })
            return
        }

        const { alert } = req.body
        if (alert !== null && !['System exception', 'Scheduled start failure', 'Runtime Exceeded', 'Terminated'].includes(alert)) {
            res.status(400).json({
                success: false,
                message: "Invalid alert type"
            })
            return
        }

        await robot.update({ alert })
        res.status(200).json({
            success: true,
            data: robot
        })
    } catch (error) {
        next(error)
    }
}

// Delete a robot
export const deleteRobot: RequestHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({
                success: false,
                message: "Robot not found"
            })
            return
        }

        await robot.destroy()
        res.status(200).json({
            success: true,
            message: "Robot deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}
