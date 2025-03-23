import { Request, Response, NextFunction, ErrorRequestHandler, RequestHandler } from 'express'
import { validationResult } from 'express-validator'

// Handle input validation errors
export const handlerInputErrors: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
        return
    }
    next()
}

interface CustomError extends Error {
    status?: number;
    code?: string;
}

// Handle errors
export const errorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error:', err)

    // Handle Sequelize errors
    if (err.name === 'SequelizeConnectionError') {
        res.status(503).json({
            success: false,
            message: 'Database connection error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
        })
        return
    }

    // Handle validation errors
    if (err.name === 'SequelizeValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Invalid data'
        })
        return
    }

    // Handle other errors
    const statusCode = err.status || 500
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong'
    })
}