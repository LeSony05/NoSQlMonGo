# HƯỚNG DẪN CHI TIẾT THỰC HIỆN BÀI TẬP TỔNG HỢP MONGODB
**Dự án:** Quản lý Nhân sự & Dự án (HRM System)  
**Database:** `hrm_mongodb`  
**Công nghệ đề xuất:** MongoDB + NestJS (Backend) + Next.js (Frontend)

---

## 📁 1. CẤU TRÚC THƯ MỤC CHUẨN NỘP BÀI

Đặt tên thư mục gốc theo cú pháp đề yêu cầu: `MSSV_HoTen_MongoDB/`

```text
MSSV_HoTen_MongoDB/
├── README.md                           # Báo cáo tổng hợp & hướng dẫn chạy hệ thống
├── data/                               # Chứa 3 file dữ liệu nguồn JSON chuẩn Extended JSON
│   ├── departments.json
│   ├── employees.json
│   └── projects.json
├── scripts/                            # 8 file script Mongosh chạy độc lập
│   ├── 01_create_database.js
│   ├── 02_basic_queries.js
│   ├── 03_array_nested_queries.js
│   ├── 04_projection_sort.js
│   ├── 05_update_data.js
│   ├── 06_delete_data.js
│   ├── 07_aggregation.js
│   └── 08_create_indexes.js
├── backend/                            # Ứng dụng Backend NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── departments/
│   │   │   ├── employees/
│   │   │   ├── projects/
│   │   │   └── dashboard/              # Xử lý Aggregation Pipelines
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── ...
├── frontend/                           # Ứng dụng Frontend Next.js (App Router + Tailwind)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── employees/page.tsx      # Câu 9: Quản lý nhân viên CRUD
│   │   │   └── dashboard/page.tsx      # Câu 10: Dashboard HRM & Dự án
│   │   ├── components/
│   │   └── services/api.ts
│   ├── package.json
│   └── ...
└── screenshots/                        # Ảnh chụp minh chứng theo yêu cầu
    ├── 01_mongoimport.png
    ├── 02_scripts_run/                 # Kết quả chạy từ script 02 đến 08
    ├── 03_ui_employees_crud.png
    └── 04_ui_dashboard.png
```

---

## 📑 2. GIAI ĐOẠN 1: CHUẨN BỊ DỮ LIỆU JSON (`data/`)

> **Lưu ý cốt lõi:**
> - Các trường số (`salary`, `budget`, `hoursPerWeek`) tuyệt đối **không** để trong ngoặc kép `""`.
> - Trạng thái `active` phải là kiểu Boolean (`true` / `false`).
> - Kiểu ngày sử dụng định dạng Strict Extended JSON MongoDB: `{"$date": "YYYY-MM-DDTHH:mm:ssZ"}` để khi `mongoimport` sẽ nhận diện chuẩn kiểu `ISODate`.

### 2.1. File `data/departments.json` (4 phòng ban)
```json
[
  {
    "departmentCode": "IT",
    "departmentName": "Công nghệ thông tin",
    "location": "Tầng 3",
    "phone": "101",
    "active": true
  },
  {
    "departmentCode": "HR",
    "departmentName": "Nhân sự",
    "location": "Tầng 2",
    "phone": "102",
    "active": true
  },
  {
    "departmentCode": "SALE",
    "departmentName": "Kinh doanh",
    "location": "Tầng 4",
    "phone": "103",
    "active": true
  },
  {
    "departmentCode": "ACC",
    "departmentName": "Kế toán",
    "location": "Tầng 2",
    "phone": "104",
    "active": true
  }
]
```

### 2.2. File `data/employees.json` (10 nhân viên)
*Phải có `address` dạng Document lồng nhau và `skills` dạng Array chuỗi.*
```json
[
  {
    "employeeId": "E001",
    "fullName": "Nguyễn Văn An",
    "gender": "Nam",
    "dateOfBirth": { "$date": "1998-05-15T00:00:00Z" },
    "email": "an.nguyen@abc.com",
    "phone": "0901000001",
    "address": { "street": "15 Nguyễn Trãi", "district": "Quận 1", "city": "TP.HCM" },
    "departmentCode": "IT",
    "position": "Lập trình viên",
    "salary": 18000000,
    "hireDate": { "$date": "2022-08-01T00:00:00Z" },
    "skills": ["Java", "MongoDB", "Docker"],
    "active": true
  },
  {
    "employeeId": "E002",
    "fullName": "Trần Thị Bình",
    "gender": "Nữ",
    "dateOfBirth": { "$date": "1997-03-21T00:00:00Z" },
    "email": "binh.tran@abc.com",
    "phone": "0901000002",
    "address": { "street": "22 Lê Văn Sỹ", "district": "Quận 3", "city": "TP.HCM" },
    "departmentCode": "HR",
    "position": "Chuyên viên nhân sự",
    "salary": 14000000,
    "hireDate": { "$date": "2021-06-15T00:00:00Z" },
    "skills": ["Excel", "Communication"],
    "active": true
  },
  {
    "employeeId": "E003",
    "fullName": "Lê Minh Cường",
    "gender": "Nam",
    "dateOfBirth": { "$date": "1995-11-02T00:00:00Z" },
    "email": "cuong.le@abc.com",
    "phone": "0901000003",
    "address": { "street": "18 Phan Văn Trị", "district": "Bình Thạnh", "city": "TP.HCM" },
    "departmentCode": "IT",
    "position": "Lập trình viên cao cấp",
    "salary": 28000000,
    "hireDate": { "$date": "2020-02-10T00:00:00Z" },
    "skills": ["Java", "Spring Boot", "Redis"],
    "active": true
  },
  {
    "employeeId": "E004",
    "fullName": "Phạm Thùy Dung",
    "gender": "Nữ",
    "dateOfBirth": { "$date": "1999-07-12T00:00:00Z" },
    "email": "dung.pham@abc.com",
    "phone": "0901000004",
    "address": { "street": "45 Nguyễn Văn Linh", "district": "Quận 7", "city": "TP.HCM" },
    "departmentCode": "SALE",
    "position": "Nhân viên kinh doanh",
    "salary": 13000000,
    "hireDate": { "$date": "2023-01-05T00:00:00Z" },
    "skills": ["Communication", "Excel"],
    "active": true
  },
  {
    "employeeId": "E005",
    "fullName": "Võ Quốc Em",
    "gender": "Nam",
    "dateOfBirth": { "$date": "1996-09-18T00:00:00Z" },
    "email": "em.vo@abc.com",
    "phone": "0901000005",
    "address": { "street": "71 Cộng Hòa", "district": "Tân Bình", "city": "TP.HCM" },
    "departmentCode": "IT",
    "position": "Kỹ sư DevOps",
    "salary": 24000000,
    "hireDate": { "$date": "2021-10-11T00:00:00Z" },
    "skills": ["Docker", "Redis", "MongoDB"],
    "active": true
  },
  {
    "employeeId": "E006",
    "fullName": "Đỗ Hương Giang",
    "gender": "Nữ",
    "dateOfBirth": { "$date": "1998-12-30T00:00:00Z" },
    "email": "giang.do@abc.com",
    "phone": "0901000006",
    "address": { "street": "30 Bạch Đằng", "district": "Hải Châu", "city": "Đà Nẵng" },
    "departmentCode": "HR",
    "position": "Chuyên viên tuyển dụng",
    "salary": 15000000,
    "hireDate": { "$date": "2022-03-20T00:00:00Z" },
    "skills": ["Communication", "LinkedIn"],
    "active": true
  },
  {
    "employeeId": "E007",
    "fullName": "Bùi Mạnh Hùng",
    "gender": "Nam",
    "dateOfBirth": { "$date": "1994-04-05T00:00:00Z" },
    "email": "hung.bui@abc.com",
    "phone": "0901000007",
    "address": { "street": "81 Trần Hưng Đạo", "district": "Quận 5", "city": "TP.HCM" },
    "departmentCode": "ACC",
    "position": "Kế toán viên",
    "salary": 17000000,
    "hireDate": { "$date": "2019-09-01T00:00:00Z" },
    "skills": ["Excel", "Accounting"],
    "active": true
  },
  {
    "employeeId": "E008",
    "fullName": "Nguyễn Tử Lan",
    "gender": "Nữ",
    "dateOfBirth": { "$date": "2000-01-20T00:00:00Z" },
    "email": "lan.nguyen@abc.com",
    "phone": "0901000008",
    "address": { "street": "25 Quang Trung", "district": "Gò Vấp", "city": "TP.HCM" },
    "departmentCode": "IT",
    "position": "Lập trình viên Frontend",
    "salary": 16000000,
    "hireDate": { "$date": "2024-02-12T00:00:00Z" },
    "skills": ["JavaScript", "React", "Docker"],
    "active": true
  },
  {
    "employeeId": "E009",
    "fullName": "Trần Hoàng Minh",
    "gender": "Nam",
    "dateOfBirth": { "$date": "1993-06-25T00:00:00Z" },
    "email": "minh.tran@abc.com",
    "phone": "0901000009",
    "address": { "street": "19 Lê Lợi", "district": "Quận 1", "city": "TP.HCM" },
    "departmentCode": "SALE",
    "position": "Trưởng phòng kinh doanh",
    "salary": 30000000,
    "hireDate": { "$date": "2018-05-14T00:00:00Z" },
    "skills": ["Communication", "CRM"],
    "active": false
  },
  {
    "employeeId": "E010",
    "fullName": "Lê Thanh Nga",
    "gender": "Nữ",
    "dateOfBirth": { "$date": "1999-10-08T00:00:00Z" },
    "email": "nga.le@abc.com",
    "phone": "0901000010",
    "address": { "street": "52 Điện Biên Phủ", "district": "Thanh Khê", "city": "Đà Nẵng" },
    "departmentCode": "ACC",
    "position": "Kế toán viên",
    "salary": 12000000,
    "hireDate": { "$date": "2023-07-17T00:00:00Z" },
    "skills": ["Excel", "Accounting"],
    "active": false
  }
]
```

### 2.3. File `data/projects.json` (4 dự án)
```json
[
  {
    "projectId": "P001",
    "projectName": "Hệ thống quản lý đào tạo",
    "startDate": { "$date": "2026-01-10T00:00:00Z" },
    "endDate": { "$date": "2026-10-30T00:00:00Z" },
    "budget": 500000000,
    "status": "In Progress",
    "managerId": "E003",
    "members": [
      { "employeeId": "E003", "role": "Project Manager", "joinDate": { "$date": "2026-01-10T00:00:00Z" }, "hoursPerWeek": 30 },
      { "employeeId": "E001", "role": "Backend Developer", "joinDate": { "$date": "2026-01-15T00:00:00Z" }, "hoursPerWeek": 25 },
      { "employeeId": "E008", "role": "Frontend Developer", "joinDate": { "$date": "2026-01-20T00:00:00Z" }, "hoursPerWeek": 20 }
    ]
  },
  {
    "projectId": "P002",
    "projectName": "Cổng tuyển dụng trực tuyến",
    "startDate": { "$date": "2026-03-01T00:00:00Z" },
    "endDate": { "$date": "2026-12-15T00:00:00Z" },
    "budget": 320000000,
    "status": "In Progress",
    "managerId": "E001",
    "members": [
      { "employeeId": "E001", "role": "Project Manager", "joinDate": { "$date": "2026-03-01T00:00:00Z" }, "hoursPerWeek": 25 },
      { "employeeId": "E006", "role": "Business Analyst", "joinDate": { "$date": "2026-03-05T00:00:00Z" }, "hoursPerWeek": 15 },
      { "employeeId": "E008", "role": "Frontend Developer", "joinDate": { "$date": "2026-03-10T00:00:00Z" }, "hoursPerWeek": 20 }
    ]
  },
  {
    "projectId": "P003",
    "projectName": "Ứng dụng quản lý bán hàng",
    "startDate": { "$date": "2025-05-10T00:00:00Z" },
    "endDate": { "$date": "2025-12-20T00:00:00Z" },
    "budget": 280000000,
    "status": "Completed",
    "managerId": "E005",
    "members": [
      { "employeeId": "E005", "role": "Project Manager", "joinDate": { "$date": "2025-05-10T00:00:00Z" }, "hoursPerWeek": 25 },
      { "employeeId": "E003", "role": "Backend Developer", "joinDate": { "$date": "2025-05-15T00:00:00Z" }, "hoursPerWeek": 20 },
      { "employeeId": "E004", "role": "Sales Consultant", "joinDate": { "$date": "2025-05-20T00:00:00Z" }, "hoursPerWeek": 10 }
    ]
  },
  {
    "projectId": "P004",
    "projectName": "Hệ thống chấm công thông minh",
    "startDate": { "$date": "2026-08-01T00:00:00Z" },
    "endDate": { "$date": "2027-02-28T00:00:00Z" },
    "budget": 450000000,
    "status": "Planning",
    "managerId": "E005",
    "members": [
      { "employeeId": "E005", "role": "Project Manager", "joinDate": { "$date": "2026-08-01T00:00:00Z" }, "hoursPerWeek": 20 },
      { "employeeId": "E007", "role": "Data Analyst", "joinDate": { "$date": "2026-08-05T00:00:00Z" }, "hoursPerWeek": 15 },
      { "employeeId": "E008", "role": "Frontend Developer", "joinDate": { "$date": "2026-08-10T00:00:00Z" }, "hoursPerWeek": 15 }
    ]
  }
]
```

### 2.4. Lệnh import dữ liệu qua Terminal (hoặc dùng MongoDB Compass)
```bash
mongoimport --db hrm_mongodb --collection departments --file data/departments.json --jsonArray --drop
mongoimport --db hrm_mongodb --collection employees --file data/employees.json --jsonArray --drop
mongoimport --db hrm_mongodb --collection projects --file data/projects.json --jsonArray --drop
```

---

## 💻 3. GIAI ĐOẠN 2: CÁC SCRIPT MONGODB CHUẨN (`scripts/`)

Chạy bằng công cụ **mongosh**: `mongosh hrm_mongodb scripts/<ten_script>.js`

### 3.1. `01_create_database.js`
```javascript
use hrm_mongodb;
db.createCollection("departments");
db.createCollection("employees");
db.createCollection("projects");
print("Database và Collections đã được khởi tạo!");
```

### 3.2. `02_basic_queries.js` (Câu 2)
```javascript
use hrm_mongodb;

// 1. Toàn bộ nhân viên
db.employees.find();

// 2. Nhân viên có mã E005
db.employees.findOne({ employeeId: "E005" });

// 3. Nhân viên đang làm việc
db.employees.find({ active: true });

// 4. Nhân viên phòng IT
db.employees.find({ departmentCode: "IT" });

// 5. Lương trên 20 triệu
db.employees.find({ salary: { $gt: 20000000 } });

// 6. Lương từ 15 đến 25 triệu
db.employees.find({ salary: { $gte: 15000000, $lte: 25000000 } });

// 7. Phòng IT đang làm việc
db.employees.find({ departmentCode: "IT", active: true });

// 8. Không thuộc phòng HR
db.employees.find({ departmentCode: { $ne: "HR" } });
```

### 3.3. `03_array_nested_queries.js` (Câu 3)
```javascript
use hrm_mongodb;

// 1. Sống tại TP.HCM
db.employees.find({ "address.city": "TP.HCM" });

// 2. Sống tại Quận 1
db.employees.find({ "address.district": "Quận 1" });

// 3. Có kỹ năng Java
db.employees.find({ skills: "Java" });

// 4. Có đồng thời Java và MongoDB
db.employees.find({ skills: { $all: ["Java", "MongoDB"] } });

// 5. Có một trong hai kỹ năng Redis hoặc Docker
db.employees.find({ skills: { $in: ["Redis", "Docker"] } });

// 6. Phòng IT có kỹ năng Docker
db.employees.find({ departmentCode: "IT", skills: "Docker" });

// 7. Dự án có E001 tham gia
db.projects.find({ "members.employeeId": "E001" });

// 8. Dự án có thành viên làm > 20 giờ/tuần
db.projects.find({ "members.hoursPerWeek": { $gt: 20 } });

// 9. Dự án có E008 làm Frontend Developer
db.projects.find({
  members: {
    $elemMatch: { employeeId: "E008", role: "Frontend Developer" }
  }
});
```

### 3.4. `04_projection_sort.js` (Câu 4)
```javascript
use hrm_mongodb;

// 1. Chỉ hiển thị mã, họ tên, lương (không hiển thị _id)
db.employees.find({}, { _id: 0, employeeId: 1, fullName: 1, salary: 1 });

// 2. Hiển thị tên, phòng ban, kỹ năng của nhân viên đang làm việc
db.employees.find(
  { active: true },
  { _id: 0, fullName: 1, departmentCode: 1, skills: 1 }
);

// 3. Lương tăng dần
db.employees.find().sort({ salary: 1 });

// 4. Lương giảm dần
db.employees.find().sort({ salary: -1 });

// 5. Ba nhân viên có lương cao nhất
db.employees.find().sort({ salary: -1 }).limit(3);

// 6. Bỏ qua 3 đầu, lấy 3 tiếp theo
db.employees.find().sort({ salary: -1 }).skip(3).limit(3);

// 7. Sắp xếp theo phòng ban tăng dần, sau đó theo lương giảm dần
db.employees.find().sort({ departmentCode: 1, salary: -1 });
```

### 3.5. `05_update_data.js` (Câu 5)
```javascript
use hrm_mongodb;

// 1. Đổi số điện thoại của E002
db.employees.updateOne({ employeeId: "E002" }, { $set: { phone: "0909999999" } });

// 2. Tăng lương E001 thêm 2 triệu
db.employees.updateOne({ employeeId: "E001" }, { $inc: { salary: 2000000 } });

// 3. Chuyển E004 sang phòng SALE (nếu dữ liệu chưa đúng)
db.employees.updateOne({ employeeId: "E004" }, { $set: { departmentCode: "SALE" } });

// 4. Đánh dấu E008 đã nghỉ việc
db.employees.updateOne({ employeeId: "E008" }, { $set: { active: false } });

// 5. Tăng 5% lương cho nhân viên phòng IT
db.employees.updateMany({ departmentCode: "IT" }, { $mul: { salary: 1.05 } });

// 6. Thêm kỹ năng Git cho E001
db.employees.updateOne({ employeeId: "E001" }, { $addToSet: { skills: "Git" } });

// 7. Thêm Git cho tất cả nhân viên đang làm việc (không trùng)
db.employees.updateMany({ active: true }, { $addToSet: { skills: "Git" } });

// 8. Xóa kỹ năng Redis khỏi E003
db.employees.updateOne({ employeeId: "E003" }, { $pull: { skills: "Redis" } });

// 9. Thêm E005 vào P002 với vai trò Technical Consultant
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

// 10. Thay đổi giờ làm của E008 trong P001 thành 25 giờ
db.projects.updateOne(
  { projectId: "P001", "members.employeeId": "E008" },
  { $set: { "members.$.hoursPerWeek": 25 } }
);

// 11. Xóa E004 khỏi danh sách thành viên dự án P003
db.projects.updateOne(
  { projectId: "P003" },
  { $pull: { members: { employeeId: "E004" } } }
);
```

### 3.6. `06_delete_data.js` (Câu 6)
```javascript
use hrm_mongodb;

// 1. Thêm & xóa nhân viên TEST01
db.employees.insertOne({ employeeId: "TEST01", fullName: "Nhân viên Test", active: false });
db.employees.deleteOne({ employeeId: "TEST01" });

// 2. Thêm & xóa dự án TESTP01
db.projects.insertOne({ projectId: "TESTP01", projectName: "Dự án Test", status: "Planning" });
db.projects.deleteOne({ projectId: "TESTP01" });

// 3. Xóa tất cả nhân viên có active = false (Kiểm tra count trước và sau)
print("Số NV trước khi xóa: " + db.employees.countDocuments());
db.employees.deleteMany({ active: false });
print("Số NV sau khi xóa: " + db.employees.countDocuments());
```

### 3.7. `07_aggregation.js` (Câu 7)
```javascript
use hrm_mongodb;

// 1-4. Thống kê theo phòng ban: số NV, lương trung bình, max, min
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

// 5. Chỉ hiển thị phòng ban có từ 2 nhân viên trở lên
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

// 6. Đếm số dự án theo trạng thái
db.projects.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// 7. Tổng ngân sách các dự án đang thực hiện (In Progress)
db.projects.aggregate([
  { $match: { status: "In Progress" } },
  { $group: { _id: null, totalBudget: { $sum: "$budget" } } }
]);

// 8. Tách mảng skills để đếm số nhân viên theo từng kỹ năng
db.employees.aggregate([
  { $unwind: "$skills" },
  { $group: { _id: "$skills", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// 9. Tách mảng members để đếm số thành viên của từng dự án
db.projects.aggregate([
  { $unwind: "$members" },
  {
    $group: {
      _id: { projectId: "$projectId", projectName: "$projectName" },
      memberCount: { $sum: 1 }
    }
  }
]);
```

### 3.8. `08_create_indexes.js` (Câu 8)
```javascript
use hrm_mongodb;

// 1. Unique index cho departments & employees & projects
db.departments.createIndex({ departmentCode: 1 }, { unique: true });
db.employees.createIndex({ employeeId: 1 }, { unique: true });
db.employees.createIndex({ email: 1 }, { unique: true });
db.projects.createIndex({ projectId: 1 }, { unique: true });

// 2. Compound index cho departmentCode và salary
db.employees.createIndex({ departmentCode: 1, salary: -1 });

// 3. Hiển thị danh sách index của employees
db.employees.getIndexes();
```

---

## 🚀 4. GIAI ĐOẠN 3: XÂY DỰNG ỨNG DỤNG NESTJS & NEXT.JS (CÂU 9 & CÂU 10)

### 4.1. Backend NestJS (`backend/`)
Cung cấp REST API cho Next.js:
1. **Module Employees (`/api/employees`):**
   - `GET /api/employees`: Hỗ trợ query params: `search`, `departmentCode`, `active`, `minSalary`, `maxSalary`, `sortBy=salary`, `sortOrder=asc|desc`.
   - `GET /api/employees/:id`: Lấy chi tiết nhân viên (gồm địa chỉ, skills).
   - `POST /api/employees`: Thêm mới nhân viên.
   - `PUT /api/employees/:id`: Cập nhật nhân viên.
   - `DELETE /api/employees/:id`: Xóa nhân viên.
   - `POST /api/employees/:id/skills`: Thêm kỹ năng (`$addToSet`).
   - `DELETE /api/employees/:id/skills/:skill`: Xóa kỹ năng (`$pull`).
2. **Module Projects (`/api/projects`):**
   - `GET /api/projects`: Danh sách dự án (filter theo `status`, sort `budget`).
   - `GET /api/projects/:id`: Xem thông tin chi tiết kèm các thành viên.
3. **Module Dashboard (`/api/dashboard`):**
   - `GET /api/dashboard/overview`: Trả về 8 chỉ số (Tổng phòng ban, tổng NV, NV active/inactive, tổng dự án, In Progress, Completed, tổng ngân sách đang chạy).
   - `GET /api/dashboard/departments-stats`: Aggregation tính min, max, avg lương và đếm nhân sự theo phòng ban.
   - `GET /api/dashboard/skills-stats`: Aggregation `$unwind` mảng `skills` để đếm tần suất kỹ năng.

### 4.2. Frontend Next.js (`frontend/`)
Sử dụng Tailwind CSS và Lucid React icons:
1. **Trang Quản lý Nhân viên (`/employees` - Câu 9):**
   - Bộ lọc: Input Search (theo ID, Tên), Dropdown chọn Phòng ban, Dropdown trạng thái (Tất cả / Active / Inactive), Slider/Input khoảng lương.
   - Bảng dữ liệu: Cột Sắp xếp theo Lương (Asc/Desc), Action: Sửa, Xóa, Xem chi tiết.
   - Modal Form: Thêm/sửa thông tin (có nhập `street`, `district`, `city` và quản lý Tag danh sách `skills`).
2. **Trang Dashboard HRM (`/dashboard` - Câu 10):**
   - Hàng Cards: Thống kê số lượng tổng quan.
   - Hàng 2 cột:
     - Cột trái: Bảng thống kê phòng ban (Số NV, Lương TB, Cao nhất, Thấp nhất). Khi bấm vào 1 phòng ban $ightarrow$ tải nhanh danh sách nhân viên bên dưới.
     - Cột phải: Thống kê Kỹ năng (Danh sách kỹ năng + số người, hiển thị dạng thanh tiến độ hoặc tag badge).
   - Hàng Quản lý Dự án: Danh sách dự án (có search, filter status, sort budget). Khi bấm chọn 1 dự án $ightarrow$ mở Modal/Drawer xem Quản lý (PM) và bảng thành viên gồm Role, Số giờ/tuần.

---

## 📷 5. GIAI ĐOẠN 4: CHỤP MINH CHỨNG & NỘP BÀI
1. Chạy từng script trong thư mục `scripts/` trên Terminal Mongosh và chụp ảnh màn hình lưu vào `screenshots/`.
2. Chụp màn hình MongoDB Compass hiển thị cấu trúc Collections, Documents và Indexes.
3. Chụp các màn hình chức năng của Website Next.js (Giao diện bảng nhân viên, Form Thêm/Sửa, Trang Dashboard, Modal chi tiết dự án).
4. Viết hoàn thiện file `README.md` ở thư mục gốc: Giới thiệu dự án, công nghệ NestJS + Next.js + MongoDB, các prompt AI đã sử dụng hỗ trợ, và hướng dẫn chạy lệnh (`npm install`, `npm run start:dev`).
