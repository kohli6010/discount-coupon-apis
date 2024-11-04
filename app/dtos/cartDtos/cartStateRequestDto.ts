import { IsArray, IsObject } from "class-validator";

export class CartState {
    @IsArray()
    items: {product_id: number, quantity: number, price: number}[]
}

export default class CartStateRequestDto {
    @IsObject()
    cart: CartState
}