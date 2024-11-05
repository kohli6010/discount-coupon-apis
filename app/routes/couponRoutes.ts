import { Router } from "express";
import { Service } from "typedi";
import Routes from "../interfaces/routes";
import validationMiddleware from "../middlewares/validationMiddleware";
import CouponController from "../controllers/couponController";
import CreateCouponRequestDto from "../dtos/couponDtos/createCouponRequestDto";
import CartStateRequestDto from "../dtos/cartDtos/cartStateRequestDto";

@Service()
export default class CouponRoutes implements Routes {
    public path?: string = "/coupons";
    public router: Router;

    constructor(private couponController: CouponController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.couponController.getAll);
        this.router.get(`${this.path}/:id(\\d+)`, this.couponController.getById);
        this.router.post(this.path, validationMiddleware(CreateCouponRequestDto, 'body'), this.couponController.create);
        this.router.post(`${this.path}/applicable-coupons`, validationMiddleware(CartStateRequestDto, 'body'), this.couponController.getApplicableCoupon);
        this.router.post(`${this.path}/applicable-coupons/:id(\\d+)`, validationMiddleware(CartStateRequestDto, 'body'), this.couponController.applyCoupon);
        this.router.delete(`${this.path}/:id(\\d+)`, this.couponController.deleteById);
        this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateCouponRequestDto, 'body'), this.couponController.updateById);
    }
    
}