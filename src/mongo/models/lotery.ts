import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";

export interface ILotery extends Document {
  name: string;
  description: string;
  status: boolean;
  peyPerWin: {
    first: number;
    second: number;
    third: number;
    pale: number;
    superPale: number;
  };
  creatorUser: IUser | string;
  modifierUser?: IUser | string;
}
const loterySchema: Schema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    peyPerWin: {
      type: {
        first: Number,
        second: Number,
        third: Number,
        pale: Number,
        superPale: Number,
      },
      require: true,
    },
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
