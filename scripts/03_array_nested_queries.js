use hrm_mongodb;

db.employees.find({ "address.city": "TP.HCM" });
db.employees.find({ "address.district": "Quận 1" });
db.employees.find({ skills: "Java" });
db.employees.find({ skills: { $all: ["Java", "MongoDB"] } });
db.employees.find({ skills: { $in: ["Redis", "Docker"] } });
db.employees.find({ departmentCode: "IT", skills: "Docker" });
db.projects.find({ "members.employeeId": "E001" });
db.projects.find({ "members.hoursPerWeek": { $gt: 20 } });
db.projects.find({
  members: {
    $elemMatch: { employeeId: "E008", role: "Frontend Developer" }
  }
});
