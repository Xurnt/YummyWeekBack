import { Router, Request, Response, NextFunction } from "express"
import { Ingredient, PrismaClient } from '@prisma/client'
import { isInteger } from "../utils"

const prisma = new PrismaClient()
const express = require("express")
const router:Router = express.Router()


function parseIngredientId(ingredientId:string, response:Response) : number {
    if (!isInteger(ingredientId)){
        response.status(400)
        throw new Error('ingredientId parameter in query must be a number')
    }
    return parseInt(ingredientId)
}

function handleDatabaseQueryError(databaseResult:Ingredient|null ,message:string, response:Response): void{
    if (databaseResult == null) {
        response.status(500)
        throw new Error(message)
    }
}

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
        const ingredientId:number = parseIngredientId(request.params.ingredientId, response)
        const ingredient = await prisma.ingredient.findUnique({
            where: {id: ingredientId }
        })
        handleDatabaseQueryError(ingredient, 'Ingredient with id ' + request.params.ingredientId + ' not found', response)
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

router.delete("/:ingredientId", async(request:Request, response:Response, next: NextFunction) => {
    try {
        const ingredientId:number = parseIngredientId(request.params.ingredientId, response)
        const deletedIngredient = await prisma.ingredient.delete({
            where: {
              id: ingredientId,
            },
        })
        handleDatabaseQueryError(deletedIngredient, 'Ingredient with id ' + request.params.ingredientId + ' not found', response)
        response.json({
            message: "Ingredient deleted successfully!",
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router