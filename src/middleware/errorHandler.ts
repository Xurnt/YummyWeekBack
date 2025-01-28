import { NextFunction, Request, Response } from "express";
import config from "../config";
import { getErrorMessage } from "../utils";

export default function errorHandler(
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
){
    if (response.headersSent || config.debug) {
        next(error);
        return;
    }

    if (response.statusCode == 200){
        response.status(500)
    }

    response.json({
        error: {
            message:
                getErrorMessage(error) ||
                "An error occured. Please view logs for more details"
        }
    })
}