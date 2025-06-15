const express = require("express");
const userRouter = require('./routers/users.router')
const postRouter = require('./routers/posts.router')
const errHandlingMiddleware = require('./middleware/error-handling-middleware')

const app = express();
const PORT = process.env.PORT||3000;

app.use(express.json());
app.use("/", postRouter);
app.use("/", userRouter);

app.use(errHandlingMiddleware)

app.listen(PORT, ()=>{
    console.log(`start server!! http://localhost:${PORT}`)
})