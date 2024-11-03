import { NextFunction, Request, Response } from "express";
import AccessAllowedPermission from "../permissions/accessAllowedPermission";
import CartService from "../services/cartService";
import BaseController from "./baseController";
import AddItemInCartRequestDto from "../dtos/cartDtos/addProductInCartRequestDto";
import AddProductInCartRequestDto from "../dtos/cartDtos/addProductInCartRequestDto";
import { Service } from "typedi";

@Service()
export default class CartController extends BaseController {
    constructor(private cartService: CartService, private fullAccessAllowedPermission: AccessAllowedPermission) {
        super(fullAccessAllowedPermission);
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let response = await this.cartService.getAll();
            res.json(response);
        }catch(err) {
            next(err);
        }
    }

    public getAllCartsWithActiveProducts = async (req: Request, res: Response, next:NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let response = await this.cartService.getAllWithActiveProduct();
            res.json(response);
        }catch(err) {
            next(err);
        }
    }

    public addItemInCart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let body: AddProductInCartRequestDto = req.body;
            let response = await this.cartService.addProductInCart(body);
            res.json(response);
        }catch(err) {
            next(err);
        }
    }
}