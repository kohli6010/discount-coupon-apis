import { Service } from "typedi";
import Coupon, { CouponAttributesInput, CouponAttributesOutput } from "../models/couponModel";
import BaseDao from "./baseDao";

@Service()
export default class CouponDao extends BaseDao<CouponAttributesInput, CouponAttributesOutput> {
    constructor() {
        super(Coupon);
    }
}