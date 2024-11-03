import { Transaction } from "sequelize";
import { sequelize } from "../models/db_config";
import { Service } from "typedi";

@Service()
export default class BaseService {
    protected transaction: Transaction;

    public setTransaction = (t: Transaction) => {
        this.transaction = t;
    }

    public getTransaction = async (isolationLevel:Transaction.ISOLATION_LEVELS=null): Promise<Transaction> => {
        if (this.transaction){
            return this.transaction;
        }
        else{
            if (isolationLevel){
                return await sequelize.transaction({isolationLevel})
            }
            else{
                return await sequelize.transaction()
            }
        }
            
            
    }

    public commitTransaction = async (t: Transaction) => {
        if(this.transaction)
            return
        else
            await t.commit()
    }

    public rollbackTransaction = async (t: Transaction) => {
        console.log("Transaction rollbacked")
        if(this.transaction)
            return
        else
            if(t){
                await t.rollback()
            }
            
    }
}
