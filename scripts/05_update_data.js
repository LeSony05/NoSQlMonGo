use hrm_mongodb;

db.employees.updateOne({ employeeId: "E002" }, { $set: { phone: "0909999999" } });
db.employees.updateOne({ employeeId: "E001" }, { $inc: { salary: 2000000 } });
db.employees.updateOne({ employeeId: "E004" }, { $set: { departmentCode: "SALE" } });
db.employees.updateOne({ employeeId: "E008" }, { $set: { active: false } });
db.employees.updateMany({ departmentCode: "IT" }, { $mul: { salary: 1.05 } });
db.employees.updateOne({ employeeId: "E001" }, { $addToSet: { skills: "Git" } });
db.employees.updateMany({ active: true }, { $addToSet: { skills: "Git" } });
db.employees.updateOne({ employeeId: "E003" }, { $pull: { skills: "Redis" } });
db.projects.updateOne(
  { projectId: "P002" },
  {
    $push: {
      members: {
        employeeId: "E005",
        role: "Technical Consultant",
        joinDate: new Date(),
        hoursPerWeek: 15
      }
    }
  }
);
db.projects.updateOne(
  { projectId: "P001", "members.employeeId": "E008" },
  { $set: { "members.$.hoursPerWeek": 25 } }
);
db.projects.updateOne({ projectId: "P003" }, { $pull: { members: { employeeId: "E004" } } });
