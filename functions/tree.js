class EmployeeNode {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.directReports = [];
  }
}

class EmployeeTreeBuilder {
  buildTree(employeesData, managerId = null) {
    if (!Array.isArray(employeesData) || employeesData.length === 0) {
      return null;
    }

    const idToEmployeesMap = new Map();

    employeesData.forEach((employeeData) => {
      const employeeNode = new EmployeeNode(employeeData.id, employeeData.name);
      idToEmployeesMap.set(employeeData.id, employeeNode);
    });

    const employeeHierarchy = [];

    employeesData.forEach((employeeData) => {
      const employeeNode = idToEmployeesMap.get(employeeData.id);
      const currentManagerId = employeeData.managerId;

      if (currentManagerId === managerId) {
        const directReport = this.buildTree(employeesData, employeeData.id);
        if (directReport) {
          employeeNode.directReports = directReport;
        }
        employeeHierarchy.push(employeeNode);
      }
    });

    return employeeHierarchy.length > 0 ? employeeHierarchy : null;
  }
}

class EmployeeSearchService {
  searchEmployeeByName(employeeHierarchy, employeeToSearch, managerNames = []) {
    if (!employeeHierarchy || !employeeToSearch) {
      return { foundEmployees: [] };
    }

    let employeeSearchResult = { foundEmployees: [] };

    if (employeeHierarchy.name === employeeToSearch) {
      employeeSearchResult.foundEmployees.push({
        employee: employeeHierarchy,
        managerNames: managerNames.concat(employeeToSearch),
        directReports: this.getDirectReports(employeeHierarchy),
        indirectReports: this.getIndirectReports(employeeHierarchy),
      });
    }

    if (Array.isArray(employeeHierarchy.directReports)) {
      employeeHierarchy.directReports.forEach((directReport) => {
        const directResult = this.searchEmployeeByName(
          directReport,
          employeeToSearch,
          managerNames.concat(employeeHierarchy.name)
        );
        employeeSearchResult.foundEmployees.push(
          ...directResult.foundEmployees
        );
      });
    }

    return employeeSearchResult;
  }

  getDirectReports(employeeHierarchy) {
    return employeeHierarchy.directReports
      ? employeeHierarchy.directReports.map((directReport) => directReport.name)
      : [];
  }

  getIndirectReports(employeeHierarchy) {
    if (
      !employeeHierarchy.directReports ||
      employeeHierarchy.directReports.length === 0
    ) {
      return [];
    }

    let indirectReports = [];
    employeeHierarchy.directReports.forEach((directReport) => {
      indirectReports.push(...this.getDirectReports(directReport));
      indirectReports.push(...this.getIndirectReports(directReport));
    });

    return indirectReports;
  }
}

module.exports = {
  EmployeeTreeBuilder,
  EmployeeSearchService,
};
