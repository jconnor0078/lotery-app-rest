import { Application } from "express";
import userRoutes from "./users-routes";
import loteryRoutes from "./lotery-routes";
import ticketRoutes from "./ticket-routes";
import screenRoutes from "./screens-routes";

export default (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/loteries", loteryRoutes);
  app.use("/api/v1/tickets", ticketRoutes);
  app.use("/api/v1/screens", screenRoutes);
};
