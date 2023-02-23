import {Schema, model} from "mongoose"

const bookSchema = new Schema({
    title: {type: String, required: true, minlength:1, maxlength: 60},
    author: {type: Schema.Types.ObjectId, ref: "Author" , required: true},
    publisher: {type: String, required: true},
    numberPages: {type: Number, required: true},
    cover: {type: String}
})

export const BookModel = model("Book", bookSchema)