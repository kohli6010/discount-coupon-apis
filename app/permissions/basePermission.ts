export default class BasePermission{

    public async hasPermission(req):Promise<Boolean>{
        return false;
    }
}