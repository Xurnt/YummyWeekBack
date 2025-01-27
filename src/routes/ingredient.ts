import { Router, Request, Response } from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const express = require("express")
const router:Router = express.Router()

router.get("/", (request:Request, response:Response) => {
    response.send({ data: "get all ingredients"})
})

router.post("/", async(request:Request, response:Response) => {
    const name:string = request.body.name
    console.log(request.body)
    const result = await prisma.ingredient.create({
        data: {
            name
        }
    })
    response.json(result)
})

router.get("/:ingredientId", async(request:Request, response:Response) => {
    const ingredientId:number = parseInt(request.params.ingredientId)
    const ingredient = await prisma.ingredient.findMany({
        where: {id: ingredientId }
    })
    response.send({ data: "get ingredient with id " + request.params.ingredientId, ingredient: ingredient })
})

router.put("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "update ingredient with id " + request.params.ingredientId })
})

router.delete("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "delete ingredient with id " + request.params.ingredientId})
})


module.exports = router