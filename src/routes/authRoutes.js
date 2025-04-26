import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Route đăng ký người dùng
router.post("/register", async (req, res) => {
  const { username, password, email, phonenumber, address } = req.body;

  // Kiểm tra xem username đã tồn tại chưa
  const existingUser = db
    .prepare(`SELECT * FROM users WHERE username = ?`)
    .get(username);
  if (existingUser) {
    console.log("Username already exists");
    console.log(existingUser);
    return res.status(400).json({ message: "Username already exists" });
  }

  // Mã hóa password
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    // Insert user vào database

    const insertUser = db.prepare(`
      INSERT INTO users (username, password, email, phonenumber, address)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insertUser.run(
      username,
      hashedPassword,
      email,
      phonenumber,
      address
    );

    // Thêm 1 todo mặc định cho user mới
    const defaultTodo = `Hi ${username}, welcome to the app!`;
    const insertTodo = db.prepare(`
      INSERT INTO todos (user_id, task)
      VALUES (?, ?)
    `);
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // Tạo token cho user
    const token = jwt.sign(
      { id: result.lastInsertRowid, username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// Route đăng nhập
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Kiểm tra xem user có tồn tại trong database không
    const user = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);

    // Nếu user không tồn tại, trả về lỗi 401
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Kiểm tra mật khẩu có đúng không
    if (!user.password) {
      return res
        .status(500)
        .json({ message: "Password not found in database" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // Nếu mật khẩu sai, trả về lỗi 401
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Tạo token cho user
    const token = jwt.sign(
      { id: user.id, username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // expires in 24h
    );

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
