const express = require("express");
const employeesRouter = express.Router();
const employeesFileUpload = require("express-fileupload");
const employeesSession = require("express-session");
const {
  EmployeeHierarchyBuilder,
  EmployeeSearchService,
} = require("../functions/tree");

employeesRouter.use(employeesFileUpload());

const READ_FILE_SESSION_SECRET = "read-file-employees";
const EMPLOYEES_VIEW = "employees";

class EmployeesController {
  constructor(employeesHierarchyBuilder, employeesSearchService) {
    this.employeesHierarchyBuilder = employeesHierarchyBuilder;
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
          this.employeesHierarchyBuilder.buildTree(employeesData);

        const employeeToSearch = req.query.name;
        const employeeSearchResult =
          this.employeesSearchService.searchEmployeeByName(
            employeeHierarchy[0],
            employeeToSearch
          );

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

const employeesHierarchyBuilder = new EmployeeHierarchyBuilder();
const employeesSearchService = new EmployeeSearchService();
const employeesController = new EmployeesController(
  employeesHierarchyBuilder,
  employeesSearchService
);

employeesRouter.use(
  employeesSession({
    secret: READ_FILE_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

employeesRouter.get("/", (req, res) =>
  employeesController.getEmployeesTree(req, res)
);
employeesRouter.post("/", (req, res) =>
  employeesController.uploadFileEmployees(req, res)
);

module.exports = employeesRouter;
