import { NextFunction, Request, Response } from "express";
import BasePermission from "../permissions/basePermission";
import { HttpException } from "../exceptions/httpException";

export default class BaseController{
    permissionClassObj: BasePermission;

    constructor(permissionClassObj:BasePermission){
        this.permissionClassObj = permissionClassObj
    }

    public async validateRequestPermission(req: Request, res: Response, next: NextFunction){
        let hasPermission = await this.permissionClassObj.hasPermission(req)
        if (hasPermission){
            return true
        }
        else{
            throw new HttpException(401,"Token Data Invalid/Expired")
        }
    }
    
}