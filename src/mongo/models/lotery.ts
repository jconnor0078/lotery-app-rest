import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";

export interface ILotery extends Document {
  name: string;
  description: string;
  status: boolean;
  userCreator: IUser | string;
  userModifier?: IUser | string;
}
const loterySchema: Schema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    status: { type: Boolean },
    userCreator: { type: Schema.Types.ObjectId, ref: "User", require: true },
    userModifier: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const loteryModel = model<ILotery>("Lotery", loterySchema);

export default loteryModel;
