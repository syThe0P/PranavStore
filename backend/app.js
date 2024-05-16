import express from 'express'

const app = express();


//Route Imports
const product = require("./routes/productRoute");

app.use("/api/v1",product);


export default app;