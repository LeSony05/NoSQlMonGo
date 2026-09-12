use hrm_mongodb;

db.departments.createIndex({ departmentCode: 1 }, { unique: true });
db.employees.createIndex({ employeeId: 1 }, { unique: true });
db.employees.createIndex({ email: 1 }, { unique: true });
db.projects.createIndex({ projectId: 1 }, { unique: true });
db.employees.createIndex({ departmentCode: 1, salary: -1 });
db.employees.getIndexes();
