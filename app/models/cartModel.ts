import { BelongsToGetAssociationMixin, DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./db_config";
import { Service } from "typedi";
import { CustomerAttributesOutput } from "./customerModel";

export interface CartAttributes {
    id?: number;
    customerId?: number
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CartAttributesInput extends Optional<CartAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export interface CartAttributesOutput extends Required<CartAttributes> { }

@Service()
class Cart extends Model<CartAttributesInput, CartAttributesOutput> implements CartAttributes {
    public id: number;
    public customerId: number
    public createdAt: Date;
    public updatedAt: Date;

    declare getCustomer: BelongsToGetAssociationMixin<CustomerAttributesOutput>
}

Cart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
        tableName: 'carts',
        timestamps: true,
        modelName: 'cart',
        sequelize: sequelize
    }
);

export default Cart;