import { Service } from "typedi";
import BaseDao from "./baseDao";
import Cart, { CartAttributesInput, CartAttributesOutput } from "../models/cartModel";

@Service()
export default class CartDao extends BaseDao<CartAttributesInput, CartAttributesOutput> {
    constructor() {
        super(Cart);
    }
}