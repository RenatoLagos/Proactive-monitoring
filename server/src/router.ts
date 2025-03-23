import { Router } from "express"
import { body, param } from 'express-validator'
import { createRobots, getRobots, getRobotById, updateRobot, updateRobotStatus, updateRobotAlert, deleteRobot } from "./handlers/robots"
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
 *                  alert:
 *                      type: string
 *                      enum: [null, "System exception", "Scheduled start failure", "Runtime Exceeded", "Terminated"]
 *                      description: The current alert status of the robot
 *                      example: null
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

/**
 * @swagger
 * /api/robots/{id}:
 *      get:
 *         summary: Get a robot by id
 *         tags: 
 *              - Robots
 *         description: Returns a robot by id
 *         parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: The id of the robot
 *         responses:
 *             200:
 *                description: Successful response
 *                content:
 *                   application/json:
 *                      schema:
 *                         $ref: '#/components/schemas/Robot'
 *             404:
 *                description: Robot not found
 *             400:
 *                description: Bad request
 */

router.get("/:id",
    param('id', 'Id not valid').isInt(),
    handlerInputErrors,
    getRobotById
)

/**
 * @swagger
 * /api/robots:
 *      post:
 *          summary: Create a new robot
 *          tags:
 *              - Robots
 *          description: Create a new robot
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "R2D2"
 *                              status:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              201:
 *                  description: Robot created successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Robot'
 *              400:
 *                  description: Bad request
 */

router.post("/", 
    body('name', 'Name is required').notEmpty(),
    body('status', 'Status is required').notEmpty(),
    handlerInputErrors,
    createRobots
)

/**
 * @swagger
 * /api/robots/{id}:
 *      put:
 *          summary: Update a robot
 *          tags:
 *              - Robots
 *          description: Update a robot
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: The id of the robot
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "R2D2"
 *                              status:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Robot updated successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Robot'
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Robot not found
 */
router.put("/:id", 
    param('id', 'Id not valid').isInt(),
    body('name', 'Name is required').notEmpty().isString(),
    body('status', 'Status is required').notEmpty().isBoolean(),
    handlerInputErrors,
    updateRobot
)

/**
 * @swagger
 * /api/robots/{id}:
 *      patch:
 *          summary: Update a robot status
 *          tags:
 *              - Robots
 *          description: Update a robot status
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: The id of the robot
 *          responses:
 *              200:
 *                  description: Robot updated successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Robot'
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Robot not found
 */

router.patch("/:id",
    param('id', 'Id not valid').isInt(),
    handlerInputErrors,
    updateRobotStatus
)

/**
 * @swagger
 * /api/robots/{id}/alert:
 *      patch:
 *          summary: Update a robot alert
 *          tags:
 *              - Robots
 *          description: Update a robot alert
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: The id of the robot
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              alert:
 *                                  type: string
 *                                  enum: [null, "System exception", "Scheduled start failure", "Runtime Exceeded", "Terminated"]
 *                                  description: The current alert status of the robot
 *                                  example: null
 *          responses:
 *              200:
 *                  description: Robot updated successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Robot'
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Robot not found
 */

router.patch("/:id/alert",
    param('id', 'Id not valid').isInt(),
    body('alert').custom((value: any) => {
        if (value !== null && !['System exception', 'Scheduled start failure', 'Runtime Exceeded', 'Terminated'].includes(value)) {
            throw new Error('Invalid alert type')
        }
        return true
    }),
    handlerInputErrors,
    updateRobotAlert
)

/**
 * @swagger
 * /api/robots/{id}:
 *      delete:
 *          summary: Delete a robot
 *          tags:
 *              - Robots
 *          description: Delete a robot
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: integer
 *                required: true
 *                description: The id of the robot
 *          responses:
 *              200:
 *                  description: Robot deleted successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              value: "Robot deleted"
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Robot not found
 */

router.delete("/:id",
    param('id', 'Id not valid').isInt(),
    handlerInputErrors,
    deleteRobot
)

export default router