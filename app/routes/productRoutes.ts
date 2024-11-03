import { Router } from "express";
import { Service } from "typedi";
import Routes from "../interfaces/routes";
import validationMiddleware from "../middlewares/validationMiddleware";
import ProductController from "../controllers/productController";
import CreateProductRequestDto from "../dtos/productDtos/createProductRequestDto";

@Service()
export default class ProductRoutes implements Routes {
    public path?: string = "/products";
    public router: Router;

    constructor(private productController: ProductController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.productController.getAll);
        this.router.post(this.path, validationMiddleware(CreateProductRequestDto, 'body'), this.productController.create);
    }
    
}