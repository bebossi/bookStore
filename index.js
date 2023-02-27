import express from "express";
import * as dotenv from "dotenv";
import {connectToDb } from "./config/db.config.js"
import { bookRouter } from "./routes/book.routes.js";
import { authorRouter } from "./routes/author.routes.js"
import { userRouter } from "./routes/user.routes.js";

dotenv.config();

connectToDb();

const app = express();

app.use(express.json());

app.use("/book", bookRouter)
app.use("/author", authorRouter)
app.use("/user", userRouter)


app.listen(Number(process.env.PORT), () => {
    console.log(`server up and running at port ${process.env.PORT}`)
})