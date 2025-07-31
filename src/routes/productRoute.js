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

const router = express.Router();

// Search and suggestions routes - these should come BEFORE specific routes like /:id
router.get("/search", searchProductsByName);
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
