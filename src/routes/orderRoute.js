import express from "express";

import auth from "../middlewares/auth.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import { ROLE_ADMIN } from "../constants/roles.js";
import { getOrderSummary } from "../controllers/orderController.js";
import {
  checkoutOrder,
  confirmOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/api/khalti/payment-detail", async (req, res) => {
  const { pidx } = req.body;

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/detail/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Khalti detail error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Khalti payment detail fetch failed" });
  }
});

// /api/orders
router.get("/", auth, roleBasedAuth(ROLE_ADMIN), getAllOrders);

router.get("/summary", auth, getOrderSummary);

router.get("/user/:userId", auth, getOrdersByUser);

router.get("/:id", auth, getOrderById);

router.post("/", auth, createOrder);

router.put("/:id/status", auth, roleBasedAuth(ROLE_ADMIN), updateOrderStatus);

router.put("/:id/checkout", auth, checkoutOrder);

router.put("/:id/confirm", auth, confirmOrder);

router.delete("/:id", auth, roleBasedAuth(ROLE_ADMIN), deleteOrder);

export default router;
