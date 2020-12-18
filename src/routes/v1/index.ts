import { Application } from "express";
import userRoutes from "./users-routes";
import loteryRoutes from "./lotery-routes";
import ticketRoutes from "./ticket-routes";
import screenRoutes from "./screens-routes";
import awardRoutes from "./award-routes";
import reportRoutes from './reports-routes';
import squareRoutes from './square-routes';

export default (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/loteries", loteryRoutes);
  app.use("/api/v1/tickets", ticketRoutes);
  app.use("/api/v1/screens", screenRoutes);
  app.use("/api/v1/awards", awardRoutes);
  app.use("/api/v1/reports", reportRoutes);
  app.use("/api/v1/squares", squareRoutes);
};
