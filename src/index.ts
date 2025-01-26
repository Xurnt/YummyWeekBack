import express, { Request, Response } from "express";
const dotenv = require("dotenv");

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (request:Request, response:Response) => { 
  response.status(200).send("Hello World");
}); 

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error:Error) => {
  // gracefully handle error
  throw new Error(error.message);
})