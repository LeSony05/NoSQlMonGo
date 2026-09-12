use hrm_mongodb;

db.employees.insertOne({ employeeId: "TEST01", fullName: "Nhân viên Test", active: false });
db.employees.deleteOne({ employeeId: "TEST01" });
db.projects.insertOne({ projectId: "TESTP01", projectName: "Dự án Test", status: "Planning" });
db.projects.deleteOne({ projectId: "TESTP01" });
print("So NV truoc khi xoa: " + db.employees.countDocuments());
db.employees.deleteMany({ active: false });
print("So NV sau khi xoa: " + db.employees.countDocuments());
