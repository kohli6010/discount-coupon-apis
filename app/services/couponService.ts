import { Service } from "typedi";
import CouponDao from "../daos/couponDao";
import ProductDao from "../daos/productDao";
import CouponResponseDto from "../dtos/couponDtos/couponResponseDto";
import CreateCouponRequestDto from "../dtos/couponDtos/createCouponRequestDto";
import { HttpException } from "../exceptions/httpException";
import { CouponAttributesInput, ProductType } from "../models/couponModel";
import BaseService from "./baseService";
import Randomstring from "randomstring";
import CartStateRequestDto from "../dtos/cartDtos/cartStateRequestDto";

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
    
            switch(product) {
                case "cart-wise": {
                    couponDetails.product = ProductType.CART;
                    let keysForCartWise = ["threshold", "discount"]
                    Object.keys(details).forEach((key) => {
                        if(!keysForCartWise.includes(key)) {
                            throw new HttpException(400, `${key} should not exist in the details.`);
                        }
                    })
                    let minimumCartAmount = 0;
                    let discountAmount = 0;
                    if(details.threshold) {
                        minimumCartAmount = details.threshold;
                    }
    
                    if(details.discount) {
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
                        if(!keysForCartWise.includes(key)) {
                            throw new HttpException(400, `${key} should not exist in the details.`);
                        }
                    })
                    if(details.product_id) {
                        let product = await this.productDao.getById(details.product_id);
                        if(!product) {
                            throw new HttpException(400, `No product found with provided id: ${details.product_id}`);
                        }
                    }
                    
                    let discountAmount = 0;
                    if(details.discount) {
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
                        if(!keysForCartWise.includes(key)) {
                            throw new HttpException(400, `${key} should not exist in the details.`);
                        }
                    })
                    let buyProducts = details.buy_products;

                    if(!buyProducts.length) {
                        throw new HttpException(400, "No products mentioned for buy products for BxGy coupon");
                    }

                    let getProducts = details.get_products;
                    if(!getProducts.length) {
                        throw new HttpException(400, "No products mentioned for get products for BxGy coupon");
                    }

                    
                    let usageAllowed = details.repition_limit ? details.repition_limit : 1;

                    for(let i = 0; i < buyProducts.length; i++) {
                        let productId = buyProducts[i].product_id;
                        let product = await this.productDao.getById(productId);
                        if(!product) {
                            throw new HttpException(400, `No product found with product id: ${productId}`);
                        }
                    }

                    for(let i = 0; i < getProducts.length; i++) {
                        let productId = buyProducts[i].product_id;
                        let product = await this.productDao.getById(productId);
                        if(!product) {
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
        }catch(err) {
            await this.rollbackTransaction(t);
            throw err;
        }
    }

    public getApplicableCoupon = async(data: CartStateRequestDto) => {
        let items = data.cart.items;
        let totalCartPrice = items.map(item => item.price).reduce((acc, val) => {
            return acc + val;
        }, 0)

        let productIdSet = new Set(items.map(item => item.product_id));
        let productQuantityMap = new Map();
        items.forEach(item => {
            productQuantityMap.set(item.product_id, {quantity: item.quantity, price: item.price});
        });

        let allCoupons = await this.couponDao.getAll({
            isActive: true
        });
        
        
        let applicableCoupons = [];

        for(let coupon of allCoupons) {
            switch(coupon.product) {
                case ProductType.CART: {
                    if(coupon.ruleSet["minimumCartAmount"] < totalCartPrice) {
                        applicableCoupons.push({
                            coupon_id: coupon.id,
                            type: "cart-wise",
                            discount: (( coupon.ruleSet["discountAmount"] / 100 ) * totalCartPrice).toFixed(2)
                        })
                    }
                    break;
                }

                case ProductType.PRODUCT: {
                    if(productIdSet.has(coupon.ruleSet["productId"])) {
                        let product = await this.productDao.getById(coupon.ruleSet["productId"]);
                        applicableCoupons.push({
                            coupon_id: coupon.id,
                            type: "product-wise",
                            discount: ((coupon.ruleSet["discountAmount"] / 100) * product.amount).toFixed(2)
                        })
                    }
                    break;
                }

                case ProductType.BxGy: {
                    let buyProducts = coupon.ruleSet["buyProducts"];
                    let buyProductQuantityMap = new Map();
                    buyProducts.forEach(item => {
                        buyProductQuantityMap.set(item.product_id, item.quantity);
                    });

                    let getProducts = coupon.ruleSet["getProducts"];
                    let getProductQuantityMap = new Map();
                    getProducts.forEach(item => {
                        getProductQuantityMap.set(item.product_id, item.quantity);
                    });

                    let usageAllowed = coupon.ruleSet["usageAllowed"];

                    

                    break;
                }

                default: {
                    continue;
                }
            }

        }
        
        return applicableCoupons;
    }
}