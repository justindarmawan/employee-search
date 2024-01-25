const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Use EJS as view
app.set("view engine", "ejs");

// Serve static files in public dir
app.use(express.static("public"));

const employeeRouter = require("./routes/employees");
const EMPLOYEES_VIEW = "employees";

app.use(`/${EMPLOYEES_VIEW}`, employeeRouter);

app.get("*", (_, res) => {
  res.redirect(`/${EMPLOYEES_VIEW}`);
});

app.listen(port, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
    return;
  }
  console.log(`App listening on port ${port}`);
});
