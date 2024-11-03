import { Service } from "typedi";
import BaseService from "./baseService";
import CustomerDao from "../daos/customerDao";
import CreateCustomerRequestDto from "../dtos/customerDtos/createCustomerRequestDto";
import CartDao from "../daos/cartDao";
import CartResponseDto from "../dtos/cartDtos/cartResponseDto";
import CustomerResponseDto from "../dtos/customerDtos/customerResponseDto";

@Service()
export default class CustomerService extends BaseService {
    
    constructor(private customerDao: CustomerDao, private cartDao: CartDao) {
        super();
    }

    public getAll = async () => {
        let resultFromDB = await this.customerDao.getAll();
        let response = [];
        for await (const result of resultFromDB) {
            response.push(await CustomerResponseDto.toResponse(result));
        }
        return response
    }

    public create = async (data: CreateCustomerRequestDto) => {
        let t = await this.getTransaction();
        try {
            let customer = await this.customerDao.create(data, t);
            let cart = await this.cartDao.create({
                customerId: customer.id
            }, t);
            let cartResponseDto = CartResponseDto.toResponse(cart);
            await this.commitTransaction(t);
            return await CustomerResponseDto.toResponse(customer, cartResponseDto);
        }catch(err) {
            await this.rollbackTransaction(t);
            throw err;
        }
    }
}