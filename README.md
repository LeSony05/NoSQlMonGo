# HRM MongoDB - NestJS + Next.js

Dự án bài tập tổng hợp MongoDB: quản lý phòng ban, nhân viên, dự án và dashboard thống kê.

## Cấu trúc

```text
.
├── data/
├── scripts/
├── backend/
├── frontend/
└── screenshots/
```

## Yêu cầu

- Node.js 20+
- MongoDB hoặc Docker
- `mongosh` và `mongoimport`

## Chạy MongoDB

```bash
docker compose up -d
```

## Import dữ liệu

```bash
mongoimport --db hrm_mongodb --collection departments --file data/departments.json --jsonArray --drop
mongoimport --db hrm_mongodb --collection employees --file data/employees.json --jsonArray --drop
mongoimport --db hrm_mongodb --collection projects --file data/projects.json --jsonArray --drop
```

## Chạy script MongoDB

```bash
mongosh hrm_mongodb scripts/01_create_database.js
mongosh hrm_mongodb scripts/02_basic_queries.js
mongosh hrm_mongodb scripts/03_array_nested_queries.js
mongosh hrm_mongodb scripts/04_projection_sort.js
mongosh hrm_mongodb scripts/05_update_data.js
mongosh hrm_mongodb scripts/06_delete_data.js
mongosh hrm_mongodb scripts/07_aggregation.js
mongosh hrm_mongodb scripts/08_create_indexes.js
```

## Chạy backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Backend mặc định chạy tại `http://localhost:3001/api`.

## Chạy frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:3000`.

## API chính

- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `POST /api/employees/:id/skills`
- `DELETE /api/employees/:id/skills/:skill`
- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/dashboard/overview`
- `GET /api/dashboard/departments-stats`
- `GET /api/dashboard/skills-stats`

## Prompt AI đã dùng

Yêu cầu: dựa trên file `HUONG_DAN_MONGODB_BTTL.md` để tạo project chuẩn cấu trúc Next.js + NestJS cho bài tập MongoDB.
