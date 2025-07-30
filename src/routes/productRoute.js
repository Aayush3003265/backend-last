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
} from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import { ROLE_ADMIN, ROLE_MERCHANT } from "../constants/roles.js";

const router = express.Router();

/**
 * URL: /api/products
 * Method: GET
 * Get all products
 */
router.get("/", getAllProducts);
//for rating
router.post("/:id/rate", rateProduct);
router.get("/popular", getPopularProducts);

// /api/products/users
router.get("/users", auth, getProductsByUser);

router.get("/categories", getCategories);
router.get("/brands", getBrands);

router.get("/category/:category", getProductsByCategory);
router.get("/brand/:brand", getProductsByBrand);

/**
 * URL: /api/products/:id
 * Method: GET
 * Get product by id
 */
router.get("/:id", getProductById);

/**
 * URL: /api/products
 * Method: POST
 * Create product
 */
router.post("/", auth, roleBasedAuth(ROLE_MERCHANT), createProduct);
// router.post(
//   "/",
//   auth,
//   roleBasedAuth(ROLE_MERCHANT),
//   upload.array("images", 5), // <== this is required to handle multipart/form-data
//   createProduct
// );

/**
 * URL: /api/products/:id
 * Method: PUT
 * Update product
 */
router.put("/:id", auth, roleBasedAuth(ROLE_MERCHANT), updateProduct);

/**
 * URL: /api/products/:id
 * Method: DELETE
 * Delete product
 */
router.delete("/:id", auth, roleBasedAuth(ROLE_ADMIN), deleteProduct);

export default router;
