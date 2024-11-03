import { Service } from "typedi";
import ProductDao from "../daos/productDao";
import CreateProductRequestDto from "../dtos/productDtos/createProductRequestDto";
import ProductResponseDto from "../dtos/productDtos/productResponseDto";
import BaseService from "./baseService";

@Service()
export default class ProductService extends BaseService {
    constructor(private productDao: ProductDao) {
        super();
    }

    public getAll = async () => {
        let resultFromDB = await this.productDao.getAll();
        let response = resultFromDB.map(ProductResponseDto.toResponse);
        return response;
    }

    public create = async (data: CreateProductRequestDto) => {
        let product = await this.productDao.create(data);
        return ProductResponseDto.toResponse(product);
    }
}