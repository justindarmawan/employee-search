const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const session = require("express-session");
const { buildTree, searchEmployeeByName } = require("../functions/tree");

router.use(fileUpload());

router.use(
  session({
    secret: "read-file-employees",
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => {
  try {
    const jsonData = req.session ? req.session.fileContents : null;
    if (jsonData) {
      json = JSON.parse(jsonData);
      treeRoots = buildTree(json);
      employeeToSearch = req.query.name;
      result = searchEmployeeByName(treeRoots[0], employeeToSearch);
      if (result.foundEmployees.length > 0) {
        result.foundEmployees.forEach((map) => {
          map.managerNames.push(employeeToSearch);
        });
      }
      res.render("employee", {
        data: result,
        name: employeeToSearch,
        root: treeRoots,
        fileContents: jsonData,
      });
    } else {
      res.render("employee");
    }
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    res.status(500).send("Error parsing JSON");
  }
});

router.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  uploadedFile = req.files.file;
  fileContents = uploadedFile.data.toString("utf8");
  req.session.fileContents = fileContents;
  res.redirect("/employees");
});

module.exports = router;
