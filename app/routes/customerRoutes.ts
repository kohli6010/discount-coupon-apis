import { Router } from "express";
import { Service } from "typedi";
import Routes from "../interfaces/routes";
import CustomerController from "../controllers/customerController";
import validationMiddleware from "../middlewares/validationMiddleware";
import CreateCustomerRequestDto from "../dtos/customerDtos/createCustomerRequestDto";

@Service()
export default class CustomerRoutes implements Routes {
    public path?: string = "/customers";
    public router: Router;

    constructor(private customerController: CustomerController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.customerController.getAll);
        this.router.post(this.path, validationMiddleware(CreateCustomerRequestDto, 'body'), this.customerController.create);
    }
    
}