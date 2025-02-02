import { Request, Response } from 'express'
import Robots from '../models/Robots.model'

export const createRobots = async(req: Request, res: Response) => {
    const robot = await Robots.create(req.body)
    res.json({data: robot})
}