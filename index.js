const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();
app.use(bodyParser.json());

const userRoutes = require("./routes/user");
const candidateRoutes = require("./routes/candidate");


app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server is live on port: ", PORT);
});