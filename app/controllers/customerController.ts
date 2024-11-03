import { Service } from "typedi";
import BaseController from "./baseController";
import { NextFunction, Request, Response } from "express";
import CustomerService from "../services/customerService";
import AccessAllowedPermission from "../permissions/accessAllowedPermission";
import CreateCustomerRequestDto from "../dtos/customerDtos/createCustomerRequestDto";

@Service()
export default class CustomerController extends BaseController {
    
    constructor(private customerService: CustomerService, private fullAccessAllowedPermission: AccessAllowedPermission){
        super(fullAccessAllowedPermission);
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let customers = await this.customerService.getAll();
            res.json(customers);
        }catch(err) {
            next(err);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let body: CreateCustomerRequestDto = req.body;
            let response = await this.customerService.create(body);
            res.json(response);
        }catch(err) {
            console.log(err);
            next(err);
        }
    }
}