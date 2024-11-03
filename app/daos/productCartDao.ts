import { Service } from "typedi";
import ProductCart, { ProductCartAttributesInput, ProductCartAttributesOutput } from "../models/productCartModel";
import BaseDao from "./baseDao";

@Service()
export default class ProductCartDao extends BaseDao<ProductCartAttributesInput, ProductCartAttributesOutput> {
    constructor() {
        super(ProductCart);
    }

    public getProductCart = async (cartId: number, productId: number) => {
        return ProductCart.findOne({
            where: {
                cartId: cartId,
                productId: productId
            }
        });
    }
}