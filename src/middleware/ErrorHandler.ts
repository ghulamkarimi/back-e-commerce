 import { CustomError } from "../interface/user"
import { Request, Response, NextFunction } from "express"

export const ErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}


export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error: CustomError = new Error(`Not Found - ${req.originalUrl}`)
    error.statusCode = 404
    next(error)
}