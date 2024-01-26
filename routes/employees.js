const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const session = require("express-session");
const {
  EmployeesTreeBuilder,
  EmployeesSearchService,
} = require("../functions/tree");

router.use(fileUpload());

const SESSION_SECRET = "read-file-employees";
const EMPLOYEES_VIEW = "employees";

class EmployeesController {
  constructor(employeesTreeBuilder, employeesSearchService) {
    this.employeesTreeBuilder = employeesTreeBuilder;
    this.employeesSearchService = employeesSearchService;
  }

  getEmployeesTree(req, res) {
    try {
      const employeesJsonData = req.session ? req.session.fileContents : null;

      if (employeesJsonData) {
        const employeesData = JSON.parse(employeesJsonData);
        const treeRoots = this.employeesTreeBuilder.buildTree(employeesData);
        const employeeToSearch = req.query.name;
        const result = this.employeesSearchService.searchEmployeeByName(
          treeRoots[0],
          employeeToSearch
        );

        if (result.foundEmployees.length > 0) {
          result.foundEmployees.forEach((map) => {
            map.managerNames.push(employeeToSearch);
          });
        }

        res.render(EMPLOYEES_VIEW, {
          data: result,
          name: employeeToSearch,
          root: treeRoots,
          fileContents: employeesJsonData,
        });
      } else {
        res.render(EMPLOYEES_VIEW);
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send("Error rendering employee page");
    }
  }

  uploadFileEmployees(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploadedFile = req.files.file;
    const fileContents = uploadedFile.data.toString("utf8");
    req.session.fileContents = fileContents;

    res.redirect(`/${EMPLOYEES_VIEW}`);
  }
}

const employeesTreeBuilder = new EmployeesTreeBuilder();
const employeesSearchService = new EmployeesSearchService();
const employeesController = new EmployeesController(
  employeesTreeBuilder,
  employeesSearchService
);

router.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => employeesController.getEmployeesTree(req, res));
router.post("/", (req, res) =>
  employeesController.uploadFileEmployees(req, res)
);

module.exports = router;
