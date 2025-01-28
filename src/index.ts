import express, { Router } from "express";
import errorHandler from "./middleware/errorHandler";
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

// Import routes
const ingredientRoute:Router = require("./routes/ingredient")

app.use(bodyParser.json());

// Use routes
app.use("/ingredient", ingredientRoute)

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error:Error) => {
  // gracefully handle error
  throw new Error(error.message);
})

app.use(errorHandler)
