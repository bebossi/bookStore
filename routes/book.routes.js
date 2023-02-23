import express from "express";
import { BookModel } from "../models/book.model.js";

const bookRouter = express.Router()

bookRouter.post("/", async (req, res) => {
    try{
        const newbook = await BookModel.create({...req.body})

        return res.status(201).json(newbook)

    } catch(err){
        console.log(err)
    }
})

bookRouter.get("/", async (req, res) => {
    try{
        const books = await BookModel.find().populate("author")

        return res.status(200).json(books)


    } catch(err){
        console.log(err)
    }
})

bookRouter.get("/:id", async (req, res) => {
    try{
        let { id } = req.params

        const book = await BookModel.findById(id).populate("author")

        return res.status(200).json(book)

    } catch(err){
        console.log(err)
    }
})

bookRouter.put("/:id", async (req, res) => {
    try{
        let { id } = req.params

        const updatedbook = await BookModel.findByIdAndUpdate(id, {...req.body}, {new: true})

        return res.status(200).json(updatedbook)

    } catch(err){
        console.log(err)
    }
})

bookRouter.delete("/:id", async (req, res) => {
    try{
        let { id } = req.params

        const deletedBook = await BookModel.findByIdAndDelete(id)

        res.status(200).json({message: " deleted book"})

    } catch(err){
        console.log(err)
    }
})

bookRouter.get("/:publisher" , async(req, res) => {
    try{
        const publisher = req.query

        BookModel.find({"publisher": publisher})

          return res.status(200).send(BookModel)
        

    } catch(err) {
        console.log(err)
    }
})

export { bookRouter }