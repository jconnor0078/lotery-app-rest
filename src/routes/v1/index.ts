import { Application } from "express";
import userRoutes from "./users-routes";
import loteryRoutes from "./lotery-routes";

export default (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/loteries", loteryRoutes);
};
