use hrm_mongodb;

db.employees.find();
db.employees.findOne({ employeeId: "E005" });
db.employees.find({ active: true });
db.employees.find({ departmentCode: "IT" });
db.employees.find({ salary: { $gt: 20000000 } });
db.employees.find({ salary: { $gte: 15000000, $lte: 25000000 } });
db.employees.find({ departmentCode: "IT", active: true });
db.employees.find({ departmentCode: { $ne: "HR" } });
