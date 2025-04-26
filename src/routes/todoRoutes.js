import express from "express";
import db from "../db.js";

const router = express.Router();
//get all todos for logged-in user
// GET /api/products - lấy tất cả products
router.get("/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to get products" });
  }
});
router.get("/profile/customer/:id", (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare(
      `SELECT id, username, email, phonenumber, address FROM users WHERE id = ?`
    );
    const user = stmt.get(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to get customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});
export default router;
