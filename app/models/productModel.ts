import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./db_config";
import { Service } from "typedi";

export interface ProductAttributes {
    id?: number;
    name?: string;
    amount?: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductAttributesInput extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export interface ProductAttributesOutput extends Required<ProductAttributes> { }

@Service()
class Product extends Model<ProductAttributesInput, ProductAttributesOutput> implements ProductAttributes {
    public id?: number;
    public name?: string;
    public amount?: number;
    public description?: string;
    public createdAt?: Date;
    public updatedAt?: Date;
}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
        tableName: 'products',
        timestamps: true,
        modelName: 'product',
        sequelize: sequelize
    }
);

export default Product;