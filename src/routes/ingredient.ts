import { Router, Request, Response } from "express"

const express = require("express")
const router:Router = express.Router()

router.get("/", (request:Request, response:Response) => {
    response.send({ data: "get all ingredients"})
})

router.post("/", (request:Request, response:Response) => {
    response.send({ data: "add ingredient"})
})

router.get("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "get ingredient with id " + request.params.ingredientId })
})

router.put("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "update ingredient with id " + request.params.ingredientId })
})

router.delete("/:ingredientId", (request:Request, response:Response) => {
    response.send({ data: "delete ingredient with id " + request.params.ingredientId})
})


module.exports = router