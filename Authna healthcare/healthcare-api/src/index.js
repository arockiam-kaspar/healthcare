import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";


import users from "./routes/users";

const  app = express();

app.use(bodyParser.json());
app.use("/api/users", users);

app.listen(4000, () => console.log("Running on 4000"));