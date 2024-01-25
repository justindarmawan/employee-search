const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const session = require("express-session");
const { buildTree, searchEmployeeByName } = require("../functions/tree");

router.use(fileUpload());

const SESSION_SECRET = "read-file-employees";
const EMPLOYEES_VIEW = "employees";

router.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => {
  try {
    const jsonData = req.session ? req.session.fileContents : null;

    if (jsonData) {
      const json = JSON.parse(jsonData);
      const treeRoots = buildTree(json);
      const employeeToSearch = req.query.name;
      const result = searchEmployeeByName(treeRoots[0], employeeToSearch);

      if (result.foundEmployees.length > 0) {
        result.foundEmployees.forEach((map) => {
          map.managerNames.push(employeeToSearch);
        });
      }

      res.render(EMPLOYEES_VIEW, {
        data: result,
        name: employeeToSearch,
        root: treeRoots,
        fileContents: jsonData,
      });
    } else {
      res.render(EMPLOYEES_VIEW);
    }
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    res.status(500).send("Error rendering employee page");
  }
});

router.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const uploadedFile = req.files.file;
  const fileContents = uploadedFile.data.toString("utf8");
  req.session.fileContents = fileContents;

  res.redirect(`/${EMPLOYEES_VIEW}`);
});

module.exports = router;
