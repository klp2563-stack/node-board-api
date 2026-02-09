const express = require("express");
const router = express.Router();

const authRouter = require("./routes/authRouter");
const postsRouter = require("./routes/postsRouter");

router.use("/auth", authRouter);
router.use("/posts", postsRouter);

module.exports= router;
