import { ProductAttributesOutput } from "../../models/productModel";

export default class ProductResponseDto {
    public id?: number;
    public name?: string;
    public amount?: number;
    public description?: string;
    public createdAt?: Date;
    public updatedAt?: Date;

    public static toResponse = (data: ProductAttributesOutput): ProductResponseDto => {
        return {
            id: data.id,
            name: data.name,
            amount: data.amount,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}