import express from "express";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import nodemailer from "nodemailer";
import { Model } from "mongoose";

let transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    secure: false,
    user:"turma85wdft@hotmail.com",
    pass: "SenhaSegura@123",
  }
})

const userRouter = express.Router();

const SALT_ROUNDS = 10;

userRouter.post("/singup", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Senha invalida." });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;

    const mailOptions = {
      from: "turma85wdft@hotmail.com",
      to: createdUser.email,
      subject: "Ativação de conta",
      html: `<p>Clique no link para ativar sua conta:<p> 
      <a href=http://localhost:4000/users/activate-account/${newUser._id}>LINK</a>`,
    }

    await transporter.sendMail(mailOptions)

    return res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Email ou senha invalidos" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;

      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res.status(404).json({ message: "Email ou senha invalidos" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.put("/", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.currentUser._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    delete updatedUser._doc.passwordHash

    return res.status(200).json(updatedUser)
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.delete("/", async(req, res) => {
  try{
    await UserModel.findOneAndDelete({_id: req.currentUser._id})

    return res.status(204).json({message: "User deleted"})

  } catch(err){
    console.log(err);
    return res.status(500).json(err);
  }
})

userRouter.get("?activate-account/:idUser", async(req, res) => {
  try{
    const {idUser} = req.params;

    const user = await UserModel.findOne({_id: idUser})

    if(!user){
      return res.send("Erro na ativação da conta")
    }

    await UserModel.findByIdAndUpdate(idUser, {
      emailConfirm: true,
    })

    res.send("Usúario ativado")

  } catch(err){
    console.log(error);
    return res.status(400).json(error);
  }
})
export { userRouter };
