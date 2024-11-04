import { DataTypes, HasOneGetAssociationMixin, Model, Optional } from "sequelize";
import { sequelize } from "./db_config";
import { Service } from "typedi";
import { CartAttributesOutput } from "./cartModel";

export enum ProductType {
    CART = "CART",
    PRODUCT = "PRODUCT",
    BxGy = "BxGy"
}

export interface CouponAttributes {
    id?: number;
    couponCode?: string;
    product?: ProductType;
    isActive?: boolean;
    ruleSet?: object
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CouponAttributesInput extends Optional<CouponAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export interface CouponAttributesOutput extends Required<CouponAttributes> { }

@Service()
class Coupon extends Model<CouponAttributesInput, CouponAttributesOutput> implements CouponAttributes {
    id?: number;
    couponCode?: string;
    product?: ProductType;
    isActive?: boolean;
    ruleSet?: object;
    createdAt?: Date;
    updatedAt?: Date;
}

Coupon.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    couponCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product: {
        type: DataTypes.ENUM,
        values: [ProductType.CART, ProductType.PRODUCT, ProductType.BxGy],
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    ruleSet: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
        tableName: 'coupons',
        timestamps: true,
        modelName: 'coupon',
        sequelize: sequelize
    }
);

export default Coupon;