import { Service } from "typedi";
import CouponDao from "../daos/couponDao";
import ProductDao from "../daos/productDao";
import CouponResponseDto from "../dtos/couponDtos/couponResponseDto";
import CreateCouponRequestDto from "../dtos/couponDtos/createCouponRequestDto";
import { HttpException } from "../exceptions/httpException";
import { CouponAttributesInput, CouponAttributesOutput, ProductType } from "../models/couponModel";
import BaseService from "./baseService";
import Randomstring from "randomstring";
import CartStateRequestDto, { CartItem } from "../dtos/cartDtos/cartStateRequestDto";
import ApplyCouponResponseDto from "../dtos/couponDtos/applyCouponResponseDto";

@Service()
export default class CouponService extends BaseService {
    constructor(private couponDao: CouponDao, private productDao: ProductDao) {
        super();
    }

    public getAll = async () => {
        let allCoupons = await this.couponDao.getAll();
        let response = [];
        for (const coupon of allCoupons) {
            response.push(CouponResponseDto.toResponse(coupon));
        }

        return response;
    }

    public getById = async (id: number) => {
        let coupon = await this.couponDao.getById(id);
        if(!coupon) throw new HttpException(400, "No Coupon Found.");

        return CouponResponseDto.toResponse(coupon);
    }

    public deleteById = async (id:number) => {
        return await this.couponDao.deleteByID(id);
    }

    public update = async (id:number, data:CreateCouponRequestDto) => {
        let coupon = await this.couponDao.getById(id);
        if(!coupon) throw new HttpException(400, "No Coupon Found.");

        let type = data.type;
        let details = data.details;

        coupon.product = this.getProduct(type);

        if(coupon.product == ProductType.CART && details.threshold) {
            coupon.ruleSet["minimumCartAmount"] = details.threshold;
        }

        if([ProductType.CART, ProductType.PRODUCT].includes(coupon.product) && details.discount) {
            coupon.ruleSet["discountAmount"] = details.discount;
        }

        if(coupon.product == ProductType.PRODUCT && details.product_id) {
            coupon.ruleSet["productId"] = details.product_id;
        }

        if(coupon.product == ProductType.BxGy && details.buy_products) {
            coupon.ruleSet["buyProducts"] = details.buy_products;
        }

        if(coupon.product == ProductType.BxGy && details.get_products) {
            coupon.ruleSet["getProducts"] = details.get_products;
        }

        if(coupon.product == ProductType.BxGy && details.repition_limit) {
            coupon.ruleSet["usageAllowed"] = details.repition_limit;
        }

        let updateResult = await this.couponDao.update(coupon);
        return CouponResponseDto.toResponse(updateResult);
    }

    public create = async (data: CreateCouponRequestDto) => {
        let t = await this.getTransaction();
        try {
            let product = data.type;
            let details = data.details;
            let couponDetails: CouponAttributesInput = {
                couponCode: Randomstring.generate(7),
                isActive: true
            }

            let ruleSet = {};

            switch (product) {
                case "cart-wise": {
                    couponDetails.product = ProductType.CART;
                    let keysForCartWise = ["threshold", "discount"]
                    Object.keys(details).forEach((key) => {
                        if (!keysForCartWise.includes(key)) {
                            throw new HttpException(400, `${key} should not exist in the details.`);
                        }
                    })
                    let minimumCartAmount = 0;
                    let discountAmount = 0;
                    if (details.threshold) {
                        minimumCartAmount = details.threshold;
                    }

                    if (details.discount) {
                        discountAmount = details.discount;
                    }

                    ruleSet = {
                        minimumCartAmount,
                        discountAmount
                    }

                    break;
                }

                case "product-wise": {
                    couponDetails.product = ProductType.PRODUCT;
                    let productId = details.product_id;
                    let keysForCartWise = ["product_id", "discount"]
                    Object.keys(details).forEach((key) => {
                        if (!keysForCartWise.includes(key)) {
                            throw new HttpException(400, `${key} should not exist in the details.`);
                        }
                    })
                    if (details.product_id) {
                        let product = await this.productDao.getById(details.product_id);
                        if (!product) {
                            throw new HttpException(400, `No product found with provided id: ${details.product_id}`);
                        }
                    }

                    let discountAmount = 0;
                    if (details.discount) {
                        discountAmount = details.discount;
                    }

                    ruleSet = {
                        productId,
                        discountAmount
                    }

                    break;
                }

                case "bxgy": {
                    couponDetails.product = ProductType.BxGy;
                    let keysForCartWise = ["buy_products", "get_products", "repition_limit"];
                    Object.keys(details).forEach((key) => {
                        if (!keysForCartWise.includes(key)) {
                            throw new HttpException(400, `${key} should not exist in the details.`);
                        }
                    })
                    let buyProducts = details.buy_products;

                    if (!buyProducts.length) {
                        throw new HttpException(400, "No products mentioned for buy products for BxGy coupon");
                    }

                    let getProducts = details.get_products;
                    if (!getProducts.length) {
                        throw new HttpException(400, "No products mentioned for get products for BxGy coupon");
                    }


                    let usageAllowed = details.repition_limit ? details.repition_limit : 1;

                    for (let i = 0; i < buyProducts.length; i++) {
                        let productId = buyProducts[i].product_id;
                        let product = await this.productDao.getById(productId);
                        if (!product) {
                            throw new HttpException(400, `No product found with product id: ${productId}`);
                        }
                    }

                    for (let i = 0; i < getProducts.length; i++) {
                        let productId = buyProducts[i].product_id;
                        let product = await this.productDao.getById(productId);
                        if (!product) {
                            throw new HttpException(400, `No product found with product id: ${productId}`);
                        }
                    }

                    ruleSet = {
                        buyProducts,
                        getProducts,
                        usageAllowed
                    }

                    break;
                }

                default: {
                    throw new HttpException(400, "Wrong product found.");
                }
            }

            couponDetails.ruleSet = ruleSet;
            let coupon = await this.couponDao.create(couponDetails, t);
            await this.commitTransaction(t);
            return CouponResponseDto.toResponse(coupon);
        } catch (err) {
            await this.rollbackTransaction(t);
            throw err;
        }
    }

    public getApplicableCoupons = async (data: CartStateRequestDto) => {
        let items = data.cart.items;

        let allCoupons = await this.couponDao.getAll({
            isActive: true
        });

        let applicableCoupons = [];

        for await (let coupon of allCoupons) {
            await this.getRequiredDetailsForCoupon(coupon, applicableCoupons, items);
        }

        return {"applicable_coupons": applicableCoupons };
    }

    public applyCoupon = async (id: number, data: CartStateRequestDto) => {
        let coupon = await this.couponDao.getById(id);
        if(!coupon) throw new HttpException(400, `Invalid coupon id: ${id}`);

        let couponDetails = await this.getRequiredDetailsForCoupon(coupon, [], data.cart.items);
        
        let freeProducts = couponDetails.freeProducts;
        let buyProducts = couponDetails.buyProducts;

        let items = [...freeProducts, ...buyProducts];
        let response: ApplyCouponResponseDto = {
            updated_cart: {
                items: items
            }
        };
        response.updated_cart.total_discount = couponDetails.discount;
        response.updated_cart.total_price = couponDetails.totalCartPrice;
        response.updated_cart.final_price = couponDetails.finalPrice;

        return response;
    }

    private getRequiredDetailsForCoupon = async (coupon: CouponAttributesOutput, applicableCoupons: any[], items: CartItem[]) => {
        let totalCartPrice = items.map(item => item.price).reduce((acc, val) => {
            return acc + val;
        }, 0)

        let productIdSet = new Set(items.map(item => item.product_id));
        let productQuantityMap = new Map();
        items.forEach(item => {
            productQuantityMap.set(item.product_id, { quantity: item.quantity, price: item.price });
        });
        let result = null;
        let freeProducts = [];
        const buyProductsWithDiscountValues = [];
        switch (coupon.product) {
            case ProductType.CART: {
                if (coupon.ruleSet["minimumCartAmount"] < totalCartPrice) {
                    result = {
                        coupon_id: coupon.id,
                        type: "cart-wise",
                        discount: ((coupon.ruleSet["discountAmount"] / 100) * totalCartPrice).toFixed(2),
                    }
                    applicableCoupons.push(result)
                }
                break;
            }

            case ProductType.PRODUCT: {
                if (productIdSet.has(coupon.ruleSet["productId"])) {
                    let product = await this.productDao.getById(coupon.ruleSet["productId"]);
                    result = {
                        coupon_id: coupon.id,
                        type: "product-wise",
                        discount: ((coupon.ruleSet["discountAmount"] / 100) * product.amount).toFixed(2)
                    };

                    freeProducts.push(
                        {
                            product_id: coupon.id, 
                            quantity: productQuantityMap.get(coupon.id), 
                            total_discount: ((coupon.ruleSet["discountAmount"] / 100) * product.amount).toFixed(2)
                        });
                    applicableCoupons.push(result);
                }
                break;
            }

            case ProductType.BxGy: {
                const buyProducts = coupon.ruleSet["buyProducts"];
                const getProducts = coupon.ruleSet["getProducts"];
                let usageAllowed = coupon.ruleSet["usageAllowed"];
                
                const buyProductQuantityMap = new Map();
                buyProducts.forEach(item => buyProductQuantityMap.set(item.product_id, item.quantity));
            
                const getProductQuantityMap = new Map();
                getProducts.forEach(item => getProductQuantityMap.set(item.product_id, item.quantity));
            
                const cartProductQuantityMap = new Map();
                const cartProductPriceMap = new Map();
                const cartProducts = new Set();

                let totalDiscount = 0;
                items.forEach(item => {
                    cartProductQuantityMap.set(item.product_id, item.quantity)
                    cartProductPriceMap.set(item.product_id, item.price)
                    cartProducts.add(item.product_id);
                });

                let isCouponApplicable = true;
                let totalApplicableSet = -1;
                for(let [productId, productQuantity] of buyProductQuantityMap) {
                    let cartQuantity = cartProductQuantityMap.get(productId) || 0;
                    if(cartQuantity < productQuantity) {
                        isCouponApplicable = false;
                        break;
                    }

                    let totalSet = Math.floor(cartQuantity / productQuantity);
                    totalApplicableSet = Math.max(totalSet, totalApplicableSet);
                    buyProductsWithDiscountValues.push({
                        product_id: productId,
                        quantity: cartQuantity,
                        total_discount: 0
                    })

                    cartProducts.delete(productId);
                }

                if(!isCouponApplicable) return {};
                usageAllowed = Math.min(totalApplicableSet, usageAllowed);

                let allowedLimitForFreeProducts = 0;

                for(let [productId, quantity] of getProductQuantityMap) {
                    allowedLimitForFreeProducts += quantity;
                }

                allowedLimitForFreeProducts *= usageAllowed;
                for(let [productId, quantity] of getProductQuantityMap) {
                    let cartQuantity = cartProductQuantityMap.get(productId) || 0;
                    if(cartQuantity <= 0) continue;
                    let originalCartQuantity = cartQuantity;
                    if(allowedLimitForFreeProducts - cartQuantity < 0) {
                        cartQuantity = allowedLimitForFreeProducts
                    }

                    totalDiscount += (cartProductPriceMap.get(productId) * cartQuantity)
                    freeProducts.push({product_id: productId, quantity: originalCartQuantity, total_discount: cartProductPriceMap.get(productId) * cartQuantity});
                    allowedLimitForFreeProducts -= cartQuantity;
                    if(allowedLimitForFreeProducts < 0) break;
                    cartProducts.delete(productId);
                }  

                const remainingProducts = Array.from(cartProducts);
                let i = 0;
                while(i < remainingProducts.length) {
                    buyProductsWithDiscountValues.push({
                        product_id: remainingProducts[i],
                        quantity: cartProductQuantityMap.get(remainingProducts[i]),
                        total_discount: 0
                    })
                    i++;
                }
                
                result = {
                    coupon_id: coupon.id,
                    type: "BxGy",
                    discount: (totalDiscount).toFixed(2)
                };
                applicableCoupons.push(result);
                break;
            }
            
            

            default: {
                result = null;
                break;
            }
        }

        return {...result, totalCartPrice, finalPrice: (totalCartPrice - result.discount).toFixed(2), freeProducts, buyProducts: buyProductsWithDiscountValues};
    }

    private getProduct = (type: string) => {
        switch(type) {
            case "cart-wise": return ProductType.CART;
            case "product-wise": return ProductType.PRODUCT;
            case "bxgy": return ProductType.BxGy;
            default: return null;
        }
    }

}