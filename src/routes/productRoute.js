import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
  getProductById,
  getProductsByUser,
  updateProduct,
  getProductsByCategory,
  getProductsByBrand,
  getBrands,
  rateProduct,
  getPopularProducts,
  searchProductsByName,
} from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import { ROLE_ADMIN, ROLE_MERCHANT } from "../constants/roles.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { ORDER_STATUS_DELIVERED } from "../constants/orderStatus.js";

const router = express.Router();

// Search and suggestions routes - these should come BEFORE specific routes like /:id
router.get("/search", searchProductsByName);
// GET /api/products/:id/can-rate
// GET /api/products/:id/can-rate

// router.get("/search", searchProducts);
// backend/routes/productRoutes.js
// GET /api/products/suggestions?query=phone
router.get("/suggestions", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.json({ products: [] });

  try {
    const regex = new RegExp(query, "i"); // case-insensitive match
    const products = await Product.find({ name: regex }).limit(5);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Suggestion fetch failed" });
  }
});

// Get all products
router.get("/", getAllProducts);
// GET /api/products/:id/can-rate
router.get("/:id/can-rate", auth, async (req, res) => {
  console.log("Auth user:", req.user);
  const productId = req.params.id;
  const userId = req.user?.id;
  console.log("Product ID:", productId, "User ID:", userId);
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // Find any delivered order that contains this product
    const deliveredOrder = await Order.findOne({
      user: userId,
      status: { $in: ["Delivered", "delivered"] }, // handle case differences
      "orderItems.product": productId,
    }).lean();

    console.log("Delivered order check:", deliveredOrder); // 🔍 debug

    res.json({ canRate: !!deliveredOrder });
  } catch (err) {
    console.error("Can rate check error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rating route
router.post("/:id/rate", auth, rateProduct);

// Popular products
router.get("/popular", getPopularProducts);

// User products
router.get("/users", auth, getProductsByUser);

// Categories and brands
router.get("/categories", getCategories);
router.get("/brands", getBrands);

// Products by category/brand
router.get("/category/:category", getProductsByCategory);
router.get("/brand/:brand", getProductsByBrand);

// Get product by ID - this should come after other specific routes
router.get("/:id", getProductById);

// Create product
router.post("/", auth, roleBasedAuth(ROLE_MERCHANT), createProduct);

// Update product
router.put("/:id", auth, roleBasedAuth(ROLE_MERCHANT), updateProduct);

// Delete product
router.delete("/:id", auth, roleBasedAuth(ROLE_ADMIN), deleteProduct);

export default router;
