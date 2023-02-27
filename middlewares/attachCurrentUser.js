import { UserModel } from "../models/user.model.js";

export default async function attachCurrentUser(req, res, next){
    try{
        const userData = req.auth

        const user = await UserModel.findOne({_id: userData._id}, {passwordHash: 0})

        if (!user.emailConfirm) {
            return res.status(400).json({ message: "Usuário não ativado" });
          }

        req.currentUser = user;


        next();

    } catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}