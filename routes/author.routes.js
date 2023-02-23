import express from "express";
import { AuthorModel } from "../models/author.model.js";

const authorRouter = express.Router();

authorRouter.post("/", async (req, res) => {
  try {
    const newAuthor = await AuthorModel.create({ ...req.body });

    return res.status(201).json(newAuthor);
  } catch (err) {
    console.log(err);
  }
});

authorRouter.get("/", async (req, res) => {
  try {
    const allAuthors = await AuthorModel.find();

    return res.status(200).json(allAuthors);
  } catch (err) {
    console.log(err);
  }
});

authorRouter.get("/:id", async (req, res) => {
  try {
    let { id } = req.params;

    const author = await AuthorModel.findById(id);

    return res.status(200).json(author);
  } catch (err) {
    console.log(err);
  }
});

authorRouter.put("/:id", async (req, res) => {
  try {
    let { id } = req.params;

    const updatedAuthor = await AuthorModel.findByIdAndUpdate(id, {...req.body}, {new: true})

    return res.status(200).json(updatedAuthor)

  } catch (err) {
    console.log(err);
  }
});

authorRouter.delete("/:id", async (req, res) => {
  try {
    let { id } = req.params;

    await AuthorModel.findByIdAndDelete(id)

    return res.status(200).json({message: "Author deleted"})

  } catch (err) {
    console.log(err);
  }
});

export { authorRouter };
