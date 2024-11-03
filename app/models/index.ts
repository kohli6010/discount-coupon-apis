import Customer from './customerModel';
import Cart from './cartModel';

const db = {} as any;

db.customers = Customer;
db.carts = Cart;

db.customers.hasOne(db.carts, {foreignKey: 'customerId'});
db.carts.belongsTo(db.customers, {foreignKey: 'customerId'});

export default db;