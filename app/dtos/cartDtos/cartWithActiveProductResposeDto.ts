import Container from "typedi";
import { CartAttributesOutput } from "../../models/cartModel";
import ProductCart from "../../models/productCartModel";
import ProductCartResponseDto from "../productCartDtos/productCartResponseDto";
import ProductCartDao from "../../daos/productCartDao";

export default class CartWithActiveProductsResponseDto {
    id: number;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;

    productsInCart: ProductCartResponseDto[];
    cartAmount?: number;


    public static toResponse = async (data: CartAttributesOutput, getCartDetails?: boolean, getProductDetails?: boolean): Promise<CartWithActiveProductsResponseDto> => {
        let productCartDao = Container.get(ProductCartDao);
        let allActiveProductsInCart = await productCartDao.getAll({cartId: data.id});
        let productsInCart = [];
        let cartAmount = 0;
        for await (const res of allActiveProductsInCart) {
            let productInCart = await ProductCartResponseDto.toResponse(res, getCartDetails, getProductDetails);
            productsInCart.push(productInCart);
            cartAmount += (productInCart.productDetails.amount * productInCart.quantity);
        }

        return {
            id: data.id,
            customerId: data.customerId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            productsInCart: productsInCart,
            cartAmount
        }
    }
}