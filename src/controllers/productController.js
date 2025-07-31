import { ROLE_ADMIN } from "../constants/roles.js";
import { formatProductData } from "../helpers/dataFormatter.js";
import productService from "../services/productService.js";
// import Product from "../models/Product.js";

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts(req.query);

  const formattedProducts = products.map((product) =>
    formatProductData(product)
  );

  res.json(formattedProducts);
};

const getProductsByUser = async (req, res) => {
  const products = await productService.getAllProducts(req.query, req.user.id);

  const formattedProducts = products.map((product) =>
    formatProductData(product)
  );

  res.json(formattedProducts);
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found.");

    res.json(formatProductData(product));
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// const createProduct = async (req, res) => {
//   const userId = req.user.id;
//   const files = req.files;
//   const input = req.body;

//   try {
//     const data = await productService.createProduct(input, files, userId);

//     res.json(data);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
const createProduct = async (req, res) => {
  try {
    console.log("🔥 Hit createProduct route");

    const userId = req.user?.id;
    const files = req.files;
    const input = req.body;

    console.log("🧾 User ID:", userId);
    console.log("📦 Body:", input);
    console.log("📁 Files:", files);

    if (!files || files.length === 0) {
      throw new Error("No files received — check FormData and multer setup");
    }

    // Check if buffer exists
    if (!files[0].buffer) {
      throw new Error(
        "File buffer is missing. Multer memoryStorage may be misconfigured."
      );
    }

    const data = await productService.createProduct(input, files, userId);
    res.json(data);
  } catch (error) {
    console.error("❌ createProduct error:", error);
    res.status(500).send(error.message || "Server error");
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const files = req.files;
  const input = req.body;

  try {
    const product = await productService.getProductById(id);

    if (!product) return res.status(404).send("Product not found.");

    if (product.createdBy != user.id && !user.roles.includes(ROLE_ADMIN)) {
      return res.status(403).send("Access denied");
    }

    const data = await productService.updateProduct(id, input, files);

    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    await productService.deleteProduct(id);

    res.send(`Product delete successful of id: ${id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCategories = async (req, res) => {
  const categories = await productService.getCategories();

  res.json(categories);
};

const getBrands = async (req, res) => {
  const brands = await productService.getBrands();

  res.json(brands);
};

const getProductsByCategory = async (req, res) => {
  const category = req.params.category;

  const products = await productService.getAllProducts({ category });

  const formattedProducts = products.map((product) =>
    formatProductData(product)
  );

  res.json(formattedProducts);
};

const getProductsByBrand = async (req, res) => {
  const brand = req.params.brand;

  const products = await productService.getAllProducts({ brands: brand });

  const formattedProducts = products.map((product) =>
    formatProductData(product)
  );

  res.json(formattedProducts);
};

// POST /api/products/:id/rate
const rateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: "Invalid rating value" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Check if user already rated
    const existing = product.ratings.find((r) => r.user.toString() === userId);

    if (existing) {
      existing.value = value; // update
    } else {
      product.ratings.push({ user: userId, value });
    }

    await product.save();

    res.status(200).json({ message: "Rating submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    const productsWithRatings = products.map((p) => {
      const ratingsCount = p.ratings.length;
      const averageRating = ratingsCount
        ? p.ratings.reduce((acc, r) => acc + r.value, 0) / ratingsCount
        : 0;

      return {
        ...p,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingsCount,
      };
    });

    // Sort by averageRating descending
    productsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    // Return top 6 popular products
    res.json(productsWithRatings.slice(0, 6));
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import Product from "../models/Product.js";

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductsByUser,
  getBrands,
  getProductsByCategory,
  getProductsByBrand,
  rateProduct,
};
