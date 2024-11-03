import { CartAttributesOutput } from "../../models/cartModel";

export default class CartResponseDto {
    id: number;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;

    public static toResponse = (data: CartAttributesOutput): CartResponseDto => {
        return {
            id: data.id,
            customerId: data.customerId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}