import { Router } from "express"
import { body, param } from 'express-validator'
import { createRobots, getRobots, getRobotById, updateRobot, updateRobotStatus, deleteRobot } from "./handlers/robots"
import { handlerInputErrors } from "./middleware/index"


const router = Router()
/**
 * @swagger
 * components:
 *      schemas:
 *          Robot:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The auto-generated id of the robot
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The name of the robot
 *                      example: "R2D2"
 *                  status:
 *                      type: boolean
 *                      description: The status of the robot
 *                      example: true    
 * 
 * 
 */

/**
 * @swagger
 * /api/robots:
 *      get:
 *         summary: Get a list of robots
 *         tags: 
 *              - Robots
 *         description: Returns a list of robots
 *         responses:
 *             200:
 *                description: Successful response
 *                content:
 *                   application/json:
 *                      schema:
 *                         type: array
 *                         items:
 *                              $ref: '#/components/schemas/Robot'   
 *
 * 
 * 
 * 
 */
 
router.get("/", getRobots)

router.get("/:id",
    param('id', 'Id not valid').isInt(),
    handlerInputErrors, 
    getRobotById
)

router.post("/", 
    body('name', 'Name is required').notEmpty(),
    body('status', 'Status is required').notEmpty(),
    handlerInputErrors,
    createRobots
)

router.put("/:id", 
    param('id', 'Id not valid').isInt(),
    body('name', 'Name is required').notEmpty().isString(),
    body('status', 'Status is required').notEmpty().isBoolean(),
    handlerInputErrors,
    updateRobot
)

router.patch("/:id",
    param('id', 'Id not valid').isInt(),
    handlerInputErrors, 
    updateRobotStatus
)

router.delete("/:id",
    param('id', 'Id not valid').isInt(),
    handlerInputErrors, 
    deleteRobot
)

export default router