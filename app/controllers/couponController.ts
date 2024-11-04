import { Request, Response, NextFunction } from "express";
import AccessAllowedPermission from "../permissions/accessAllowedPermission";
import CouponService from "../services/couponService";
import BaseController from "./baseController";
import CreateCouponRequestDto from "../dtos/couponDtos/createCouponRequestDto";
import { Service } from "typedi";
import CartStateRequestDto from "../dtos/cartDtos/cartStateRequestDto";

@Service()
export default class CouponController extends BaseController {
    constructor(private couponService: CouponService, private fullAccessAllowedPermission: AccessAllowedPermission) {
        super(fullAccessAllowedPermission);
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        await super.validateRequestPermission(req, res, next);
        let response = await this.couponService.getAll();
        res.json(response);
    }

    public create = async(req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let body: CreateCouponRequestDto = req.body;
            let response = await this.couponService.create(body);
            res.json(response);
        }catch(err) {
            next(err);
        }
    }

    public getApplicableCoupon = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await super.validateRequestPermission(req, res, next);
            let body: CartStateRequestDto = req.body;
            let response = await this.couponService.getApplicableCoupon(body);
            res.json(response);
        }catch(err) {
            next(err);
        }
    }
}