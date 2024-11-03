import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./db_config";
import { Service } from "typedi";

export interface ProductCartAttributes {
    id?: number;
    cartId?: number;
    productId?: number;
    quantity?: number;
    deletedAt?: Date
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductCartAttributesInput extends Optional<ProductCartAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

export interface ProductCartAttributesOutput extends Required<ProductCartAttributes> { }

@Service()
class ProductCart extends Model<ProductCartAttributesInput, ProductCartAttributesOutput> implements ProductCartAttributes {
    public id?: number;
    public cartId?: number;
    public productId?: number;
    public quantity?: number;

    public deletedAt?: Date;
    public createdAt?: Date;
    public updatedAt?: Date;
}

ProductCart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'carts',
            key: 'id'
        },
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
        tableName: 'product-cart',
        timestamps: true,
        modelName: 'product-cart',
        sequelize: sequelize,
        paranoid: false
    }
);

export default ProductCart;