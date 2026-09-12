use hrm_mongodb;

db.employees.find({}, { _id: 0, employeeId: 1, fullName: 1, salary: 1 });
db.employees.find({ active: true }, { _id: 0, fullName: 1, departmentCode: 1, skills: 1 });
db.employees.find().sort({ salary: 1 });
db.employees.find().sort({ salary: -1 });
db.employees.find().sort({ salary: -1 }).limit(3);
db.employees.find().sort({ salary: -1 }).skip(3).limit(3);
db.employees.find().sort({ departmentCode: 1, salary: -1 });
