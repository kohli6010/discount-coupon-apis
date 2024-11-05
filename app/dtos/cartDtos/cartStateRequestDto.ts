import { IsArray, IsObject } from "class-validator";
import { Interface } from "readline";

export interface CartItem {
    product_id: number;
    quantity: number,
    price: number
}

export class CartState {
    @IsArray()
    items: CartItem[]
}

export default class CartStateRequestDto {
    @IsObject()
    cart: CartState
}