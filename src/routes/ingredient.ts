import { Router, Request, Response, NextFunction } from "express"
import { Ingredient, PrismaClient } from '@prisma/client'
import { isInteger } from "../utils"
import { BodyParameter, BodyParameterType, validateBodyParams } from "../queryTools"

const prisma = new PrismaClient()
const express = require("express")
const router:Router = express.Router()

const bodyParams:BodyParameter[] = [{name:"name", mandatory:true, type: BodyParameterType.string}]

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
        validateBodyParams(request, response, bodyParams)
        const name:string = request.body.name
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
        validateBodyParams(request, response, bodyParams)
        const name:string = request.body.name
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