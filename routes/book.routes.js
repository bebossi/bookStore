import express from "express";
import { AuthorModel } from "../models/author.model.js";
import { BookModel } from "../models/book.model.js";

const bookRouter = express.Router()

bookRouter.post("/:authorId", async (req, res) => {
    try{
        const {authorId} = req.params
        const newbook = await BookModel.create({...req.body})

        await AuthorModel.findOneAndUpdate(
            {_id: authorId},
            {$push:{ books: newbook._id}},
            {new: true, runValidators: true}
            )

        return res.status(201).json(newbook)

    }catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
          const message = Object.values(error.errors).map((value) => value.message);
          return res.status(400).json({
            error: message,
          });
        }
    
        if (error.code === 11000) {
          return res.status(400).json(error.message);
        }
    
        return res.status(500).json(error.message);
      }
})

bookRouter.get("/", async (req, res) => {
    try{
        const books = await BookModel.find()

        return res.status(200).json(books)

    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
          const message = Object.values(error.errors).map((value) => value.message);
          return res.status(400).json({
            error: message,
          });
        }
    
        if (error.code === 11000) {
          return res.status(400).json(error.message);
        }
    
        return res.status(500).json(error.message);
      }
})

bookRouter.get("/:bookId", async (req, res) => {
    try{
        let { bookId } = req.params

        const book = await BookModel.findById(bookId).populate("author")

        return res.status(200).json(book)

    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
          const message = Object.values(error.errors).map((value) => value.message);
          return res.status(400).json({
            error: message,
          });
        }
    
        if (error.code === 11000) {
          return res.status(400).json(error.message);
        }
    
        return res.status(500).json(error.message);
      }
})

bookRouter.put("/:bookId", async (req, res) => {
    try{
        let { bookId } = req.params

        const updatedbook = await BookModel.findByIdAndUpdate(bookId, {...req.body}, {new: true})

        return res.status(200).json(updatedbook)

    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
          const message = Object.values(error.errors).map((value) => value.message);
          return res.status(400).json({
            error: message,
          });
        }
    
        if (error.code === 11000) {
          return res.status(400).json(error.message);
        }
    
        return res.status(500).json(error.message);
      }
})

bookRouter.delete("/:bookId", async (req, res) => {
    try{
        const { bookId } = req.params

        const deletedBook = await BookModel.findByIdAndDelete(bookId);

        await AuthorModel.findOneAndUpdate({books: bookId },{ $pull: {books: bookId} },{runValidators: true})

        res.status(200).json({message: " deleted book"})

    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
          const message = Object.values(error.errors).map((value) => value.message);
          return res.status(400).json({
            error: message,
          });
        }
    
        if (error.code === 11000) {
          return res.status(400).json(error.message);
        }
    
        return res.status(500).json(error.message);
      }
})


export { bookRouter }