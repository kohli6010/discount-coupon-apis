import { Service } from "typedi";
import Product, { ProductAttributesInput, ProductAttributesOutput } from "../models/productModel";
import BaseDao from "./baseDao";

@Service()
export default class ProductDao extends BaseDao<ProductAttributesInput, ProductAttributesOutput>{
    constructor() {
        super(Product);
    }
}