import * as dotenv from "dotenv";

dotenv.config();

export default {
  expireToken: process.env.EXPIRE_TOKEN ?? "31104000",
  secretJwt: process.env.SECRET_JWT ?? "",
  port: process.env.PORT ?? 4000,
  whiteListHosts: process.env.WHITE_LIST_HOSTS ?? ""
};
