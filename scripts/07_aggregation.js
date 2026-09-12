use hrm_mongodb;

db.employees.aggregate([
  {
    $group: {
      _id: "$departmentCode",
      totalEmployees: { $sum: 1 },
      avgSalary: { $avg: "$salary" },
      maxSalary: { $max: "$salary" },
      minSalary: { $min: "$salary" }
    }
  }
]);

db.employees.aggregate([
  {
    $group: {
      _id: "$departmentCode",
      totalEmployees: { $sum: 1 },
      avgSalary: { $avg: "$salary" }
    }
  },
  { $match: { totalEmployees: { $gte: 2 } } }
]);

db.projects.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
db.projects.aggregate([
  { $match: { status: "In Progress" } },
  { $group: { _id: null, totalBudget: { $sum: "$budget" } } }
]);
db.employees.aggregate([
  { $unwind: "$skills" },
  { $group: { _id: "$skills", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
db.projects.aggregate([
  { $unwind: "$members" },
  {
    $group: {
      _id: { projectId: "$projectId", projectName: "$projectName" },
      memberCount: { $sum: 1 }
    }
  }
]);
