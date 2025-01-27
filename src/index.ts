import express, { Router } from "express";
const dotenv = require("dotenv");

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

const ingredientRoute:Router = require("./routes/ingredient")

app.use("/ingredient", ingredientRoute)

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error:Error) => {
  // gracefully handle error
  throw new Error(error.message);
})