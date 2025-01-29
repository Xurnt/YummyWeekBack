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

function handleDatabaseQueryError(databaseResult:Ingredient|Ingredient[]|null ,message:string, response:Response): void{
    if (databaseResult == null) {
        response.status(500)
        throw new Error(message)
    }
}

function handleBodyParameterAbsent(parameterName:string,request:Request, response:Response): void{
    if (!(parameterName in request.body)){
        response.status(400)
        throw new Error('Request body must contain a ' + parameterName + ' parameter')
    }
}

function handleBodyParameterTypeIncorrect(parameter:string, expectedType:string, parameterName:string, response:Response): void{
    if (typeof parameter != expectedType){
        response.status(400)
        throw new Error(parameterName + ' parameter in body must be a ' + expectedType)
    }
}

function handleBodyParameterStringEmpty(parameter:string, parameterName:string, response:Response): void{
    if (parameter == ""){
        response.status(400)
        throw new Error(parameterName + ' parameter in body must not be empty')
    }
}



// GET ALL INGREDIENTS

router.get("/", async(request:Request, response:Response, next: NextFunction) => {
    try {
        const ingredients = await prisma.ingredient.findMany()
        handleDatabaseQueryError(ingredients, 'Error while retrieing ingredients', response)
        response.json({
            message: "Ingredients retrieved successfully!",
            ingredients: ingredients
        })
    } catch(error){
        next(error)
    }
})


// CREATE INGREDIENT

router.post("/", async(request:Request, response:Response, next: NextFunction) => {
    try {
        handleBodyParameterAbsent("name", request, response)
        handleBodyParameterTypeIncorrect(request.body.name, "string", "Name", response)
        const name:string = request.body.name
        handleBodyParameterStringEmpty(name, "Name", response)
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

router.put("/:ingredientId", async(request:Request, response:Response, next:NextFunction) => {
    try {
        const ingredientId:number = parseIngredientId(request.params.ingredientId, response)
        handleBodyParameterAbsent("name", request, response)
        handleBodyParameterTypeIncorrect(request.body.name, "string", "Name", response)
        const name:string = request.body.name
        handleBodyParameterStringEmpty(name, "Name", response)
        const updatedIngredient = await prisma.ingredient.update({
            where: {
              id: ingredientId,
            },
            data: {
                name
            }
        })
        handleDatabaseQueryError(updatedIngredient, 'Ingredient with id ' + request.params.ingredientId + ' not found', response)
        response.json({
            message: "Ingredient updated successfully!",
        })
    } catch (error) {
        next(error)
    }
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