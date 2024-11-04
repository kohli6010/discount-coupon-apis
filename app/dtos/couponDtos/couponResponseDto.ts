import { CouponAttributesOutput, ProductType } from "../../models/couponModel";

export default class CouponResponseDto {
    id: number;
    couponCode: string;
    product: ProductType;
    isActive: boolean;
    ruleSet: object;
    createdAt: Date;
    updatedAt: Date;

    public static toResponse = (data: CouponAttributesOutput): CouponResponseDto => ({
        id: data.id,
        couponCode: data.couponCode,
        product: data.product,
        isActive: data.isActive,
        ruleSet: data.ruleSet,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    })
}