import { Service } from "typedi";
import Customer, { CustomerAttributesInput, CustomerAttributesOutput } from "../models/customerModel";
import BaseDao from "./baseDao";

@Service()
export default class CustomerDao extends BaseDao<CustomerAttributesInput, CustomerAttributesOutput> {
    constructor() {
        super(Customer);
    }
}