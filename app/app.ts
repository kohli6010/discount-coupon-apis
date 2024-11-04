import express from 'express';
import { startDbServer } from './models/db_config';
import Container from 'typedi';
import CustomerRoutes from './routes/customerRoutes';
import errorMiddleware from './middlewares/errorMiddleware';
import ProductRoutes from './routes/productRoutes';
import CartRoutes from './routes/cartRoutes';
import CouponRoutes from './routes/couponRoutes';

const app = express();

startDbServer();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", Container.get(CustomerRoutes).router);
app.use("/", Container.get(ProductRoutes).router);
app.use("/", Container.get(CartRoutes).router);
app.use("/", Container.get(CouponRoutes).router);

app.use(errorMiddleware);

export default app;