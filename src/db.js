import Database from "better-sqlite3";

// Tạo database in-memory
const db = new Database(":memory:");

// Tạo các bảng
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    phonenumber TEXT,
    address TEXT
  );

  CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    task TEXT,
    completed BOOLEAN DEFAULT 0
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    sold INTEGER DEFAULT 0,
    createdat TEXT,
    categoryid INTEGER,
    image TEXT
  );
`);

// Insert dữ liệu mẫu
const insertProduct = db.prepare(`
  INSERT INTO products (name, price, sold, createdat, categoryid, image)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const now = new Date().toISOString();

insertProduct.run(
  "Modern Chair",
  120,
  50,
  now,
  1,
  "https://storage.googleapis.com/cs-demo-data/coderstore/product_1.jpg"
);

insertProduct.run(
  "Elegant Watch",
  250,
  150,
  now,
  2,
  "https://storage.googleapis.com/cs-demo-data/coderstore/product_2.jpg"
);

insertProduct.run(
  "Running Shoes",
  90,
  200,
  now,
  3,
  "https://storage.googleapis.com/cs-demo-data/coderstore/product_3.jpg"
);

insertProduct.run(
  "Gaming Laptop",
  1500,
  300,
  now,
  4,
  "https://storage.googleapis.com/cs-demo-data/coderstore/product_4.jpg"
);

insertProduct.run(
  "Novel Book",
  30,
  400,
  now,
  5,
  "https://storage.googleapis.com/cs-demo-data/coderstore/product_5.jpg"
);

export default db;
