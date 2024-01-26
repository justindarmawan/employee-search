class EmployeeNode {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.directReports = [];
  }
}

// Builds a tree structure representing the employee hierarchy.
class EmployeesTreeBuilder {
  // Recursively builds the employee tree from the given data.
  buildTree(data, managerId = null) {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const idToEmployeesMap = new Map();

    // Create employee nodes and populate the map.
    data.forEach((employee) => {
      const employeeNode = new EmployeeNode(employee.id, employee.name);
      idToEmployeesMap.set(employee.id, employeeNode);
    });

    const roots = [];

    // Build the tree structure based on manager-subordinate relationships.
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

// Service for searching employees in the hierarchy by name.
class EmployeesSearchService {
  // Recursively searches for an employee by name in the tree.
  searchEmployeeByName(root, name, parents = []) {
    if (!root || !name) {
      return { foundEmployees: [] };
    }

    let result = { foundEmployees: [] };

    if (root.name === name) {
      // If the employee's name matches, add details to the result.
      result.foundEmployees.push({
        employee: root,
        managerNames: parents,
        directReports: this.getDirectReports(root),
        indirectReports: this.getIndirectReports(root),
      });
    }

    if (Array.isArray(root.directReports)) {
      // Search recursively in the direct reports of the employee.
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

  // Retrieves names of direct reports for a given employee.
  getDirectReports(employee) {
    return employee.directReports
      ? employee.directReports.map((direct) => direct.name)
      : [];
  }

  // Retrieves names of indirect reports for a given employee.
  getIndirectReports(employee) {
    if (!employee.directReports || employee.directReports.length === 0) {
      return [];
    }

    let indirectReports = [];
    employee.directReports.forEach((direct) => {
      // Search recursively in the indirect reports of the employee.
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
