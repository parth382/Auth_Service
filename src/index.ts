import express from "express";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

import bodyParser from "body-parser";

const startServer = async () => {

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});

};

startServer();
