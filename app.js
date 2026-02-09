require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./model/db");
const mainRouter = require("./router/mainRouter");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");



app.use(express.json());
app.use("/",mainRouter);

app.use((req, res, next)=>{
    next(new AppError("존재하지 않는 API 입니다", 404));
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server runnig on ${port}`));