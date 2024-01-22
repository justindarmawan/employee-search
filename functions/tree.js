class EmployeeNode {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.directReports = [];
  }
}

function buildTree(data, managerId = null) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const employeeMap = new Map();

  data.forEach((employee) => {
    const employeeNode = new EmployeeNode(employee.id, employee.name);
    employeeMap.set(employee.id, employeeNode);
  });

  const roots = [];

  data.forEach((employee) => {
    const employeeNode = employeeMap.get(employee.id);
    const currentManagerId = employee.managerId;

    if (
      currentManagerId === managerId ||
      (managerId === null && currentManagerId === null)
    ) {
      const subtree = buildTree(data, employee.id);
      if (subtree) {
        employeeNode.directReports = subtree;
      }
      roots.push(employeeNode);
    }
  });
  return roots.length > 0 ? roots : null;
}

function searchEmployeeByName(root, name, parents = []) {
  if (!root || !name) {
    return { foundEmployees: [] };
  }

  let result = { foundEmployees: [] };

  if (root.name === name) {
    result.foundEmployees.push({
      employee: root,
      managerNames: parents,
      directReports: getDirectReports(root),
      indirectReports: getIndirectReports(root),
    });
  }

  if (Array.isArray(root.directReports)) {
    for (const direct of root.directReports) {
      const directResult = searchEmployeeByName(direct, name, [
        ...parents,
        root.name,
      ]);
      result.foundEmployees.push(...directResult.foundEmployees);
    }
  }

  return result;
}

function getDirectReports(employee) {
  return employee.directReports
    ? employee.directReports.map((direct) => direct.name)
    : [];
}

function getIndirectReports(employee) {
  if (!employee.directReports || employee.directReports.length === 0) {
    return [];
  }

  let indirectReports = [];
  for (const direct of employee.directReports) {
    indirectReports.push(...getDirectReports(direct));
    indirectReports.push(...getIndirectReports(direct));
  }

  return indirectReports;
}

module.exports = {
  buildTree,
  searchEmployeeByName,
};
