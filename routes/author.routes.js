import express from "express";
import { AuthorModel } from "../models/author.model.js";

const authorRouter = express.Router();

authorRouter.post("/", async (req, res) => {
  try {
    const newAuthor = await AuthorModel.create({ ...req.body });

    return res.status(201).json(newAuthor);
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
});

authorRouter.get("/", async (req, res) => {
  try {
    const allAuthors = await AuthorModel.find(); 

    return res.status(200).json(allAuthors);
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
});

authorRouter.get("/:authorId", async (req, res) => {
  try {
    let { authorId } = req.params;

    const author = await AuthorModel.findById(authorId).populate("books");

    return res.status(200).json(author);
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
});

authorRouter.put("/:authorId", async (req, res) => {
  try {
    let { authorId } = req.params;

    const updatedAuthor = await AuthorModel.findByIdAndUpdate(authorId, {...req.body}, {new: true, runValidators: true})

    return res.status(200).json(updatedAuthor)

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
});

authorRouter.delete("/:authorId", async (req, res) => {
  try {
    let { authorId } = req.params;

    await AuthorModel.findByIdAndDelete(authorId)

    await AuthorModel.updateMany({author: authorId}, {author: "63f8f4b2c0ce64c8f1adc41f"})

    return res.status(200).json({message: "Author deleted"})

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
});

export { authorRouter };
