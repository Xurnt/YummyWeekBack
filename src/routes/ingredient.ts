import { Router, Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import { isInteger } from "../utils"

const prisma = new PrismaClient()
const express = require("express")
const router:Router = express.Router()

// GET ALL INGREDIENTS

router.get("/", (request:Request, response:Response) => {
    response.send({ data: "get all ingredients"})
})


// CREATE INGREDIENT

router.post("/", async(request:Request, response:Response, next: NextFunction) => {
    try {
        if (!("name" in request.body)){
            response.status(400)
            throw new Error('Request body must contain a name parameter')
        }
        if (typeof request.body.name != "string"){
            response.status(400)
            throw new Error('Name parameter in body must be a string')
        }
        const name:string = request.body.name
        if (name == ""){
            response.status(400)
            throw new Error('Name parameter in body must not be empty')
        }
        const result = await prisma.ingredient.create({
            data: {
                name
            }
        })
        response.json({
            message: "Ingredient created successfully!",
            ingredientId: result.id
        })
    } catch (error) {
        next(error)
    }
})

// GET INGREDIENT BY ID

router.get("/:ingredientId", async(request:Request, response:Response, next: NextFunction) => {
    try {
        if (!isInteger(request.params.ingredientId)){
            response.status(400)
            throw new Error('ingredientId parameter in query must be a number')
        }
        const ingredientId:number = parseInt(request.params.ingredientId)
        const ingredient = await prisma.ingredient.findUnique({
            where: {id: ingredientId }
        })
        if (ingredient == null) {
            response.status(500)
            throw new Error('Ingredient with id ' + request.params.ingredientId + ' not found')
        }
        response.json({
            message: "Ingredient retrieved successfully!",
            ingredient: ingredient
        })
    } catch(error){
        next(error)
    }
})

// UPDATE INGREDIENT

router.put("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "update ingredient with id " + request.params.ingredientId })
})

// DELETE INGREDIENT

router.delete("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "delete ingredient with id " + request.params.ingredientId})
})


module.exports = router