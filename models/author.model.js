import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        name: {type: String, required: true},
        nacionality: {type: String, required: true}
    }
)

export const AuthorModel = model("Author", authorSchema)