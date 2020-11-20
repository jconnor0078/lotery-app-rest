import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  address: string;
  birthday: Date;
  phone1: string;
  phone2?: string;
  phone3?: string;
  image: string;
  imageDocument: string;
  userName: string;
  password: string;
  roles: string[];
  creatorUser: IUser | string;
  modifierUser?: IUser | string;
}
const userSchema: Schema = new Schema(
  {
    name: { type: String, require: true },
    lastName: { type: String, require: true },
    documentType: {
      type: String,
      require: true,
      enum: ["cedula", "pasaporte"],
      default: "cedula",
    },
    documentNumber: { type: String, require: true },
    birthday: { type: Date, require: true },
    email: { type: String, require: true },
    address: { type: String, require: true },
    phone1: { type: String, require: true },
    phone2: { type: String, require: true },
    phone3: { type: String, require: true },
    image: { type: String, require: true },
    imageDocument: { type: String, require: true },
    userName: { type: String, require: true },
    password: { type: String, require: true },
    roles: [{ type: String, enum: ["admin", "seller"], default: "seller" }],
    creatorUser: { type: Schema.Types.ObjectId, ref: "User" },
    modifierUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const userModel = model<IUser>("User", userSchema);

export default userModel;
