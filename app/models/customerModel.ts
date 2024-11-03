import { DataTypes, HasOneGetAssociationMixin, Model, Optional } from "sequelize";
import { sequelize } from "./db_config";
import { Service } from "typedi";
import { CartAttributesOutput } from "./cartModel";

export interface CustomerAttributes {
    id?: number;
    fname?: string;
    lname?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CustomerAttributesInput extends Optional<CustomerAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export interface CustomerAttributesOutput extends Required<CustomerAttributes> { }

@Service()
class Customer extends Model<CustomerAttributesInput, CustomerAttributesOutput> implements CustomerAttributes {
    public id: number;
    public fname: string;
    public lname: string;
    public createdAt: Date;
    public updatedAt: Date;

    declare getCart: HasOneGetAssociationMixin<CartAttributesOutput>;
}

Customer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
        tableName: 'customers',
        timestamps: true,
        modelName: 'customer',
        sequelize: sequelize
    }
);

export default Customer;