import { IsNumber } from "class-validator";

export default class AddProductInCartRequestDto {
    @IsNumber()
    cartId: number;

    @IsNumber()
    productId: number;
}