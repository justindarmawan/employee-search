const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const session = require("express-session");
const {
  EmployeeTreeBuilder,
  EmployeeSearchService,
} = require("../functions/tree");

router.use(fileUpload());

const READ_FILE_SESSION_SECRET = "read-file-employees";
const EMPLOYEES_VIEW = "employees";

class EmployeesController {
  constructor(employeesTreeBuilder, employeesSearchService) {
    this.employeesTreeBuilder = employeesTreeBuilder;
    this.employeesSearchService = employeesSearchService;
  }

  getEmployeesTree(req, res) {
    try {
      const employeesJsonData = req.session
        ? req.session.employeesJsonData
        : null;

      if (employeesJsonData) {
        const employeesData = JSON.parse(employeesJsonData);
        const employeeHierarchy =
          this.employeesTreeBuilder.buildTree(employeesData);

        const employeeToSearch = req.query.name;
        const employeeSearchResult =
          this.employeesSearchService.searchEmployeeByName(
            employeeHierarchy[0],
            employeeToSearch
          );

        if (employeeSearchResult.foundEmployees.length > 0) {
          employeeSearchResult.foundEmployees.forEach((employee) => {
            employee.managerNames.push(employeeToSearch);
          });
        }

        res.render(EMPLOYEES_VIEW, {
          employeeSearchResult: employeeSearchResult,
          employeeToSearch: employeeToSearch,
          employeeHierarchy: employeeHierarchy,
          employeesJsonData: employeesJsonData,
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

    const uploadedFileEmployeesJSON = req.files.file;
    const employeesJsonData = uploadedFileEmployeesJSON.data.toString("utf8");
    req.session.employeesJsonData = employeesJsonData;

    res.redirect(`/${EMPLOYEES_VIEW}`);
  }
}

const employeesTreeBuilder = new EmployeeTreeBuilder();
const employeesSearchService = new EmployeeSearchService();
const employeesController = new EmployeesController(
  employeesTreeBuilder,
  employeesSearchService
);

router.use(
  session({
    secret: READ_FILE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

router.get("/", (req, res) => employeesController.getEmployeesTree(req, res));
router.post("/", (req, res) =>
  employeesController.uploadFileEmployees(req, res)
);

module.exports = router;
