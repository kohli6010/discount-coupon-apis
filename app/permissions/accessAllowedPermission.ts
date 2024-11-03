import { Service } from "typedi";
import BasePermission from "./basePermission";

/**
 * This is a simple sample permission class, we can use differnt permission classes for different users and can allow request to process or not from here.
 */
@Service()
export default class AccessAllowedPermission extends BasePermission {
    public async hasPermission(req: any):Promise<Boolean>{
        return true;
    }
}