// import { ROLE_ADMIN } from "../constants/roles.js";
// import { formatProductData } from "../helpers/dataFormatter.js";
// import productService from "../services/productService.js";
// // import Product from "../models/Product.js";

// const getAllProducts = async (req, res) => {
//   const products = await productService.getAllProducts(req.query);

//   const formattedProducts = products.map((product) =>
//     formatProductData(product)
//   );

//   res.json(formattedProducts);
// };
// // const getAllProducts = async (filters = {}, userId = null) => {
// //   const query = {};

// //   // Filter by user id if provided
// //   if (userId) {
// //     query.createdBy = userId;
// //   }

// //   // Filter by product name if filters.name exists and length >= 3
// //   if (filters.name && filters.name.length >= 3) {
// //     query.name = { $regex: filters.name, $options: "i" }; // case-insensitive partial match
// //   }

// //   // Filter by category
// //   if (filters.category) {
// //     query.category = filters.category;
// //   }

// //   // Filter by brand (you called it brands in controller)
// //   if (filters.brands) {
// //     query.brand = filters.brands;
// //   }

// //   const products = await Product.find(query).lean();

// //   return products;
// // };

// const getProductsByUser = async (req, res) => {
//   const products = await productService.getAllProducts(req.query, req.user.id);

//   const formattedProducts = products.map((product) =>
//     formatProductData(product)
//   );

//   res.json(formattedProducts);
// };

// const getProductById = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const product = await productService.getProductById(id);

//     if (!product) return res.status(404).send("Product not found.");

//     res.json(formatProductData(product));
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// // const createProduct = async (req, res) => {
// //   const userId = req.user.id;
// //   const files = req.files;
// //   const input = req.body;

// //   try {
// //     const data = await productService.createProduct(input, files, userId);

// //     res.json(data);
// //   } catch (error) {
// //     res.status(500).send(error.message);
// //   }
// // };
// const createProduct = async (req, res) => {
//   try {
//     console.log("🔥 Hit createProduct route");

//     const userId = req.user?.id;
//     const files = req.files;
//     const input = req.body;

//     console.log("🧾 User ID:", userId);
//     console.log("📦 Body:", input);
//     console.log("📁 Files:", files);

//     if (!files || files.length === 0) {
//       throw new Error("No files received — check FormData and multer setup");
//     }

//     // Check if buffer exists
//     if (!files[0].buffer) {
//       throw new Error(
//         "File buffer is missing. Multer memoryStorage may be misconfigured."
//       );
//     }

//     const data = await productService.createProduct(input, files, userId);
//     res.json(data);
//   } catch (error) {
//     console.error("❌ createProduct error:", error);
//     res.status(500).send(error.message || "Server error");
//   }
// };

// const updateProduct = async (req, res) => {
//   const id = req.params.id;
//   const user = req.user;
//   const files = req.files;
//   const input = req.body;

//   try {
//     const product = await productService.getProductById(id);

//     if (!product) return res.status(404).send("Product not found.");

//     if (product.createdBy != user.id && !user.roles.includes(ROLE_ADMIN)) {
//       return res.status(403).send("Access denied");
//     }

//     const data = await productService.updateProduct(id, input, files);

//     res.send(data);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// const deleteProduct = async (req, res) => {
//   const id = req.params.id;

//   try {
//     await productService.deleteProduct(id);

//     res.send(`Product delete successful of id: ${id}`);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// const getCategories = async (req, res) => {
//   const categories = await productService.getCategories();

//   res.json(categories);
// };

// const getBrands = async (req, res) => {
//   const brands = await productService.getBrands();

//   res.json(brands);
// };

// const getProductsByCategory = async (req, res) => {
//   const category = req.params.category;

//   const products = await productService.getAllProducts({ category });

//   const formattedProducts = products.map((product) =>
//     formatProductData(product)
//   );

//   res.json(formattedProducts);
// };

// const getProductsByBrand = async (req, res) => {
//   const brand = req.params.brand;

//   const products = await productService.getAllProducts({ brands: brand });

//   const formattedProducts = products.map((product) =>
//     formatProductData(product)
//   );

//   res.json(formattedProducts);
// };

// // POST /api/products/:id/rate
// const rateProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const userId = req.user.id;
//     const { value } = req.body;

//     if (!value || value < 1 || value > 5) {
//       return res.status(400).json({ error: "Invalid rating value" });
//     }

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     // Check if user already rated
//     const existing = product.ratings.find((r) => r.user.toString() === userId);

//     if (existing) {
//       existing.value = value; // update
//     } else {
//       product.ratings.push({ user: userId, value });
//     }

//     await product.save();

//     res.status(200).json({ message: "Rating submitted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getPopularProducts = async (req, res) => {
//   try {
//     const products = await Product.find().lean();

//     const productsWithRatings = products.map((p) => {
//       const ratingsCount = p.ratings.length;
//       const averageRating = ratingsCount
//         ? p.ratings.reduce((acc, r) => acc + r.value, 0) / ratingsCount
//         : 0;

//       return {
//         ...p,
//         averageRating: parseFloat(averageRating.toFixed(1)),
//         ratingsCount,
//       };
//     });

//     // Sort by averageRating descending
//     productsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

//     // Return top 6 popular products
//     res.json(productsWithRatings.slice(0, 6));
//   } catch (error) {
//     console.error("Error fetching popular products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// import Product from "../models/Product.js";

// export {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getCategories,
//   getProductsByUser,
//   getBrands,
//   getProductsByCategory,
//   getProductsByBrand,
//   rateProduct,
// };
import { ROLE_ADMIN } from "../constants/roles.js";
import { formatProductData } from "../helpers/dataFormatter.js";
import productService from "../services/productService.js";
import Product from "../models/Product.js";

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts(req.query);

  const formattedProducts = products.map((product) =>
    formatProductData(product)
  );

  res.json(formattedProducts);
};

// Enhanced search suggestions endpoint
const searchProductsByName = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Search term must be at least 3 characters long." });
  }

  try {
    const regex = new RegExp(name, "i"); // case-insensitive match
    const products = await Product.find({ name: regex })
      .limit(5)
      .select("name imageUrls");

    res.json(products);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
};

// Advanced search with filters
const searchProducts = async (req, res) => {
  try {
    const {
      q: searchQuery,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy = "relevance",
      page = 1,
      limit = 20,
    } = req.query;

    let query = {};
    let sort = {};

    // Text search across multiple fields
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Apply filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice); //Matches products where price >= maxPrice.
      if (maxPrice) query.price.$lte = parseFloat(maxPrice); //Matches products where price <= maxPrice.
    }

    // Apply sorting
    switch (sortBy) {
      case "price_low":
        sort = { price: 1 }; // ascending
        break;
      case "price_high":
        sort = { price: -1 }; // descending
        break;
      case "rating":
        sort = { averageRating: -1 }; // highest rating first
        break;
      case "newest":
        sort = { createdAt: -1 }; // newest products first
        break;
      default:
        sort = { createdAt: -1 }; // fallback sorting
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Product.countDocuments(query),
    ]);

    const formattedProducts = products.map((product) =>
      formatProductData(product)
    );

    res.json({
      products: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      filters: {
        searchQuery,
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ error: "Search failed" });
  }
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

// const rateProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const userId = req.user.id;
//     const { value } = req.body;

//     if (!value || value < 1 || value > 5) {
//       return res.status(400).json({ error: "Invalid rating value" });
//     }

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     const existing = product.ratings.find((r) => r.user.toString() === userId);

//     if (existing) {
//       existing.value = value;
//     } else {
//       product.ratings.push({ user: userId, value });
//     }

//     await product.save();

//     res.status(200).json({ message: "Rating submitted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
import Order from "../models/Order.js"; // add this at the top

// import Product from "../models/Product.js";
// import Order from "../models/Order.js";
import { ORDER_STATUS_DELIVERED } from "../constants/orderStatus.js";
const rateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: "Invalid rating value" });
    }

    // ✅ Check if user has a delivered order for this product
    const deliveredOrder = await Order.findOne({
      user: userId,
      status: ORDER_STATUS_DELIVERED,
      "orderItems.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        error: "You can only rate products you have purchased and received.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Update existing rating or push new
    const existing = product.ratings.find((r) => r.user.toString() === userId);

    if (existing) {
      existing.value = value;
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

    productsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    res.json(productsWithRatings.slice(0, 6));
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
  searchProductsByName,
  searchProducts,
};
