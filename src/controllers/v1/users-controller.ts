/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../mongo/models/users";
import getError from "../../mongo/models/error-helper";
import varConfig from "../../modules/config";

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method login -> req.body: ", {
      userName: req.body.userName,
      password: "*******"
    });
    const { userName, password } = req.body;
    const user = await Users.findOne({ userName });
    if (user) {
      const isOk = await bcrypt.compare(password, user.password);
      if (isOk) {
        // creando el token con su tiempo de expiracion
        const expiresTokenInt = parseInt(varConfig.expireToken, 10);
        const token = jwt.sign(
          { userId: user._id, role: user.roles },
          varConfig.secretJwt,
          {
            expiresIn: expiresTokenInt,
          }
        );

        res.send({
          status: "OK",
          message: "",
          data: { token, expiresIn: expiresTokenInt },
        });
      } else {
        res.status(403).send({
          status: "INVALID_CREDENTIALS",
          message: "user or password invalid.",
          data: null,
        });
      }
    } else {
      res.status(403).send({
        status: "INVALID_CREDENTIALS",
        message: "user or password invalid.",
        data: null,
      });
    }
  } catch (error) {
    console.log("***ERROR DOING LOGIN***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method createUser -> req.body: ", req.body);
    const {
      name,
      lastName,
      documentType,
      documentNumber,
      email,
      address,
      birthday,
      phone1,
      phone2,
      phone3,
      image,
      imageDocument,
      userName,
      password,
      roles,
    } = req.body;

    const hash = await bcrypt.hash(password, 15);

    const user = new Users();
    user.name = name;
    user.lastName = lastName;
    user.documentType = documentType;
    user.documentNumber = documentNumber;
    user.email = email;
    user.address = address;
    user.birthday = birthday;
    user.phone1 = phone1;
    if (phone2) {
      user.phone2 = phone2;
    }
    if (phone3) {
      user.phone3 = phone3;
    }
    user.image = image;
    user.imageDocument = imageDocument;
    user.userName = userName;
    user.password = hash;
    user.roles = roles;
    await user.save();

    res.send({ status: "OK", message: "user created", data: null });
  } catch (error) {
    console.log("***ERROR CREATING USERS***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method updateUser -> req.body: ", req.body);
    const {
      userId,
      name,
      lastName,
      documentType,
      documentNumber,
      email,
      address,
      birthday,
      phone1,
      phone2,
      phone3,
      image,
      imageDocument,
      userName,
      roles,
    } = req.body;

    if (!userId) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "userId invalid.",
        data: null,
      });
      return;
    }
    await Users.findByIdAndUpdate(userId, {
      name,
      lastName,
      documentType,
      documentNumber,
      email,
      address,
      birthday,
      phone1,
      phone2,
      phone3,
      image,
      imageDocument,
      userName,
      roles,
    });

    res.send({ status: "OK", message: "user updated", data: null });
  } catch (error) {
    console.log("***ERROR UPDATING USER***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method deleteUser -> req.body: ", req.body);
    const { userId } = req.body;
    if (!userId) {
      throw new Error("missing param userId");
    }
    // eliminando el usuario
    await Users.findByIdAndDelete(userId);
  } catch (error) {
    console.log("***ERROR DELETE USER***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method getUsers -> all: ");

    // colocando en select el nombre del campo igual a cero,
    //   le decimos que nos de todos los campos excepto ese
    // si colocamos el nombre del campo igual a uno,
    //  le decimos que solo nos de ese campo y no los otros.
    // nota: no puede tener convinaciones de cero y uno,
    //  porque no se permiten convinaciones de inclucions y excluciones
    const users = await Users.find().select({ password: 0, roles: 0, __v: 0 });

    res.send({ status: "OK", message: "", data: users });
  } catch (error) {
    console.log("***ERROR SEARCHING ALL USERS***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

export default { createUser, updateUser, deleteUser, getUsers, login };
