import { Request, Response } from "express"

export enum BodyParameterType {string, array, object}

export interface BodyParameter {
    name: string,
    type: BodyParameterType,
    mandatory: boolean
}

function handleBodyParameterAbsent(parameterName:string, mandatory: boolean, request:Request, response:Response): boolean{
    if (!(parameterName in request.body)){
        if (mandatory) {
            response.status(400)
            throw new Error('Request body must contain a ' + parameterName + ' parameter')
        } else {
            return false
        }
    }
    return true
}

function handleBodyParameterTypeIncorrect(parameter:string | Array<any> | Object, expectedType:BodyParameterType, parameterName:string, response:Response): void{
    if (typeof parameter != BodyParameterType[expectedType]){
        response.status(400)
        throw new Error(parameterName + ' parameter in body must be a ' + BodyParameterType[expectedType])
    }
}

function handleBodyParameterEmpty(parameter:string|Array<any>|Object, parameterName:string, response:Response): void{
    var isParameterEmpty:boolean = false
    if (typeof parameter == "string" && parameter == "") {
        isParameterEmpty=true
    }
    if (Array.isArray(parameter) && parameter.length == 0) {
        isParameterEmpty=true
    }
    if (typeof parameter == "object" && Object.keys(parameter).length == 0) {
        isParameterEmpty=true
    }
    if (isParameterEmpty){
        response.status(400)
        throw new Error(parameterName + ' parameter in body must not be empty')
    }
}

export function validateBodyParams(request:Request, response:Response, params:Array<BodyParameter>){
    for (const param of params) {
        var isParamPresent:boolean = handleBodyParameterAbsent(param.name, param.mandatory, request, response)
        if (isParamPresent) {
            handleBodyParameterTypeIncorrect(request.body[param.name], param.type, param.name, response)
            handleBodyParameterEmpty(request.body[param.name], param.name, response)
        }
    }
}
