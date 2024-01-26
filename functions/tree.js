class EmployeeNode {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.directReports = [];
  }
}

class EmployeesTreeBuilder {
  buildTree(data, managerId = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const idToEmployeesMap = new Map();

    data.forEach((employee) => {
      const employeeNode = new EmployeeNode(employee.id, employee.name);
      idToEmployeesMap.set(employee.id, employeeNode);
    });

    const roots = [];

    data.forEach((employee) => {
      const employeeNode = idToEmployeesMap.get(employee.id);
      const currentManagerId = employee.managerId;

      if (
        currentManagerId === managerId ||
        (managerId === null && currentManagerId === null)
      ) {
        const subtree = this.buildTree(data, employee.id);
        if (subtree) {
          employeeNode.directReports = subtree;
        }
        roots.push(employeeNode);
      }
    });

    return roots.length > 0 ? roots : null;
  }
}

class EmployeesSearchService {
  searchEmployeeByName(root, name, parents = []) {
    if (!root || !name) {
      return { foundEmployees: [] };
    }

    let result = { foundEmployees: [] };

    if (root.name === name) {
      result.foundEmployees.push({
        employee: root,
        managerNames: parents,
        directReports: this.getDirectReports(root),
        indirectReports: this.getIndirectReports(root),
      });
    }

    if (Array.isArray(root.directReports)) {
      root.directReports.forEach((direct) => {
        const directResult = this.searchEmployeeByName(
          direct,
          name,
          parents.concat(root.name)
        );
        result.foundEmployees.push(...directResult.foundEmployees);
      });
    }

    return result;
  }

  getDirectReports(employee) {
    return employee.directReports
      ? employee.directReports.map((direct) => direct.name)
      : [];
  }

  getIndirectReports(employee) {
    if (!employee.directReports || employee.directReports.length === 0) {
      return [];
    }

    let indirectReports = [];
    employee.directReports.forEach((direct) => {
      indirectReports.push(...this.getDirectReports(direct));
      indirectReports.push(...this.getIndirectReports(direct));
    });

    return indirectReports;
  }
}

module.exports = {
  EmployeesTreeBuilder,
  EmployeesSearchService,
};
