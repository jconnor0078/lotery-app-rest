import { Application } from "express";
import userRoutes from './users-routes';

export default (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
};
