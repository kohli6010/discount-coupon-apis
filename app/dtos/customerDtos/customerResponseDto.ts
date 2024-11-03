import Container from "typedi";
import { CartAttributesOutput } from "../../models/cartModel";
import { CustomerAttributesOutput } from "../../models/customerModel";
import CartResponseDto from "../cartDtos/cartResponseDto";
import CartDao from "../../daos/cartDao";

export default class CustomerResponseDto {
    public id: number;
    public fname: string;
    public lname: string;
    public createdAt?: Date;
    public updatedAt?: Date;
    public cart?: CartResponseDto;

    public static toResponse = async (data: CustomerAttributesOutput, cart?: CartResponseDto) => {
        // This should not be here.
        if(!cart) {
            let cartDao = Container.get(CartDao);
            let carts = await cartDao.getAll({
                customerId: data.id
            })

            if(carts.length) {
                cart = CartResponseDto.toResponse(carts[carts.length - 1]);
            }
        }

        return {
            id: data.id,
            fname: data.fname,
            lname: data.lname,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            cart
        }
    }
}