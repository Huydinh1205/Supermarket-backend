// db.js
import { Pool } from "pg";

// Kết nối PostgreSQL
const pool = new Pool({
  user: "postgres", // 👉 user đăng nhập PostgreSQL
  host: "localhost", // 👉 host
  database: "Supermarket", // 👉 tên database bạn đã tạo
  password: "12052005", // 👉 mật khẩu của bạn
  port: 5432, // 👉 cổng mặc định PostgreSQL
});
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err.stack));

export default pool;
