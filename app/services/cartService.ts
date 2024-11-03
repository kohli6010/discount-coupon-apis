import { Service } from "typedi";
import CartDao from "../daos/cartDao";
import ProductCartDao from "../daos/productCartDao";
import ProductDao from "../daos/productDao";
import AddItemInCartRequestDto from "../dtos/cartDtos/addProductInCartRequestDto";
import CartResponseDto from "../dtos/cartDtos/cartResponseDto";
import CartWithActiveProductsResponseDto from "../dtos/cartDtos/cartWithActiveProductResposeDto";
import { HttpException } from "../exceptions/httpException";
import BaseService from "./baseService";

@Service()
export default class CartService extends BaseService {
    constructor(private cartDao: CartDao, private productDao: ProductDao, private productCartDao: ProductCartDao) {
        super();
    }

    public getAll = async () => {
        let resultFromDB = await this.cartDao.getAll();
        return resultFromDB.map(CartResponseDto.toResponse);
    }

    public getAllWithActiveProduct = async () => {
        let resultFromDb = await this.cartDao.getAll();
        let response = [];
        for await (const result of resultFromDb) {
            response.push(await CartWithActiveProductsResponseDto.toResponse(result, false, true));
        }

        return response;
    }

    public addProductInCart = async(data: AddItemInCartRequestDto) => {
        let cart = await this.cartDao.getById(data.cartId);
        if(!cart) {
            throw new HttpException(400, "No cart found.");
        }

        let product = await this.productDao.getById(data.productId);
        if(!product) {
            throw new HttpException(400, "No product found");
        }

        let productCart = await this.productCartDao.getProductCart(data.cartId, data.productId);

        let t = await this.getTransaction();
        try {
            if(productCart != null) {
                let quantity = productCart.quantity;
                quantity = quantity + 1;
                productCart.quantity = quantity;
                await this.productCartDao.update(productCart, t);
            }else {
                let input = {
                    cartId: data.cartId,
                    productId: data.productId,
                    quantity: 1
                }
    
                await this.productCartDao.create(input, t);
            }
            await this.commitTransaction(t);
            return await CartWithActiveProductsResponseDto.toResponse(cart, false, true);
        }catch(err) {
            await this.rollbackTransaction(t);
            throw err;
        }
    }
}