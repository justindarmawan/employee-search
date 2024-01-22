const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;

app.set("view engine", "ejs");

const employeeRouter = require("./routes/employees");

app.use("/employees", employeeRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
