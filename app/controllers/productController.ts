import { NextFunction, Request, Response } from "express";
import AccessAllowedPermission from "../permissions/accessAllowedPermission";
import BaseController from "./baseController";
import ProductService from "../services/productService";
import CreateProductRequestDto from "../dtos/productDtos/createProductRequestDto";
import { Service } from "typedi";

@Service()
export default class ProductController extends BaseController {
    constructor(private productService: ProductService, private allowFullAccessPermission: AccessAllowedPermission) {
        super(allowFullAccessPermission);
    }

    public getAll = async(req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let response = await this.productService.getAll();
            res.json(response)
        }catch(err) {
            next(err);
        }
    }

    public create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let body:CreateProductRequestDto = req.body;
            let response = await this.productService.create(body);
            res.json(response);
        }catch(err) {
            next(err);
        }
    }
}