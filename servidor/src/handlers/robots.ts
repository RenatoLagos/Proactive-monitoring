import { Request, Response } from 'express'
import Robots from '../models/Robots.model'


// Get all robots
export const getRobots = async(req: Request, res: Response) => {
    const robots = await Robots.findAll()
    res.json({data: robots})
}

// Get a single robot
export const getRobotById = async(req: Request, res: Response) => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({message: "Robot not found"})
        }

        res.json({data: robot})

    } catch (error){
        console.log(error)
    }
}

// Create a new robot
export const createRobots = async(req: Request, res: Response) => {
    const robot = await Robots.create(req.body)
    res.status(201).json({data: robot})
}

// Update a robot
export const updateRobot = async(req: Request, res: Response) => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({message: "Robot not found"})
        }

        await robot.update(req.body)
        await robot.save()

        res.json({data: robot})

    } catch (error){
        console.log(error)
    }
}

// Update status of a robot
export const updateRobotStatus = async(req: Request, res: Response) => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({message: "Robot not found"})
        }

        robot.status = !robot.dataValues.status
        await robot.save()

        res.json({data: robot})

    } catch (error){
        console.log(error)
    }
}

// Delete a robot
export const deleteRobot = async(req: Request, res: Response) => {
    try {
        const robot = await Robots.findByPk(req.params.id)

        if(!robot) {
            res.status(404).json({message: "Robot not found"})
        }

        await robot.destroy()

        res.json({message: "Robot deleted"})

    } catch (error){
        console.log(error)
    }
}
