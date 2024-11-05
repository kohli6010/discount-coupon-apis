export class UpdatedCartItems {
    items: UpdatedCartItemsDetails[];
    total_price: number;
    total_discount: number;
    final_price: number
}

export class UpdatedCartItemsDetails {
    product_id?: number;
    quantity?: number;
    price?: number;
    total_discount?: number
}

export default class ApplyCouponResponseDto {
    updated_cart: UpdatedCartItems | any
}