import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";

export interface ILotery extends Document {
  name: string;
  description: string;
  status: boolean;
  creatorUser: IUser | string;
  modifierUser?: IUser | string;
}
const loterySchema: Schema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    status: { type: Boolean },
    creatorUser: { type: Schema.Types.ObjectId, ref: "User", require: true },
    modifierUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const loteryModel = model<ILotery>("Lotery", loterySchema);

export default loteryModel;
