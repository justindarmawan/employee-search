const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.set("view engine", "ejs");

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
