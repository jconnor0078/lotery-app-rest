import { Router } from "express";
import cors from "cors";
import ticketController from "../../controllers/v1/ticket-controller";
import { corsOptionsDelegate, isAuth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/create",
  cors(corsOptionsDelegate),
  isAuth,
  ticketController.createTicket
);
router.get(
  "/get-all",
  cors(corsOptionsDelegate),
  isAuth,
  ticketController.getTickets
);
router.get(
  "/get-by-id/:ticketId",
  cors(corsOptionsDelegate),
  isAuth,
  ticketController.getTicketById
);
router.get(
  "/get-by-code/:ticketCode",
  cors(corsOptionsDelegate),
  isAuth,
  ticketController.getTicketByCode
);
router.post(
  "/cancel-ticket",
  cors(corsOptionsDelegate),
  isAuth,
  ticketController.cancelTicket
);

export default router;
