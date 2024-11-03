import { Router } from "express";
import { Service } from "typedi";
import Routes from "../interfaces/routes";
import validationMiddleware from "../middlewares/validationMiddleware";
import CartController from "../controllers/cartController";
import AddProductInCartRequestDto from "../dtos/cartDtos/addProductInCartRequestDto";

@Service()
export default class CartRoutes implements Routes {
    public path?: string = "/carts";
    public router: Router;

    constructor(private cartController: CartController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.cartController.getAllCartsWithActiveProducts);
        this.router.post(this.path, validationMiddleware(AddProductInCartRequestDto, 'body'), this.cartController.addItemInCart);
    }
    
}