import Container, { Service } from "typedi";
import { ProductCartAttributesOutput } from "../../models/productCartModel";
import CartResponseDto from "../cartDtos/cartResponseDto";
import ProductResponseDto from "../productDtos/productResponseDto";
import CartDao from "../../daos/cartDao";
import ProductDao from "../../daos/productDao";

@Service()
export default class ProductCartResponseDto {
    public id: number;
    public cartId?: number;
    public productId?: number;
    public quantity?: number;
    public deletedAt?: Date
    public createdAt?: Date;
    public updatedAt?: Date;

    public cartDetails?: CartResponseDto;
    public productDetails?: ProductResponseDto;

    public static toResponse = async (data: ProductCartAttributesOutput, getCartDetails?: boolean, getProductDetails?: boolean): Promise<ProductCartResponseDto> => {
        let cartDetails = null;
        let productDetails = null;
        if(getCartDetails) {
            let cartDao = Container.get(CartDao);
            cartDetails = CartResponseDto.toResponse(await cartDao.getById(data.cartId));
        }

        if(getProductDetails) {
            let productDao = Container.get(ProductDao);
            productDetails = ProductResponseDto.toResponse(await productDao.getById(data.productId));
        }

        return {
            id: data.id,
            cartId: data.cartId,
            productId: data.productId,
            quantity: data.quantity,
            deletedAt: data.deletedAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            cartDetails,
            productDetails
        }
    }
}