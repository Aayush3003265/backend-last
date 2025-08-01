import orderService from "../services/orderService.js";
import Order from "../models/Order.js";
const getAllOrders = async (req, res) => {
  const orders = await orderService.getAllOrders(req.query);

  res.json(orders);
};

const getOrdersByUser = async (req, res) => {
  const user = req.user;

  const orders = await orderService.getOrdersByUser(req.query, user.id);

  res.json(orders);
};
//summary
const getOrderSummary = async (req, res) => {
  const user = req.user;
  const match = {};

  if (user.roles.includes("merchant")) {
    match.merchantId = user.id;
  }

  const summary = await Order.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
  };

  summary.forEach(({ _id, count }) => {
    if (_id) result[_id.toLowerCase()] = count;
  });

  res.json(result);
};

const getOrderById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await orderService.getOrderById(id);

    res.json(order);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

const createOrder = async (req, res) => {
  const input = req.body;
  const user = req.user;

  if (!input.orderItems || input.orderItems?.length == 0)
    return res.status(422).send("Order items are required.");

  if (!input.orderItems[0]?.product)
    return res.status(422).send("Order's product is required.");

  if (!input.totalPrice)
    return res.status(422).send("Total price is required.");

  if (!input.user) input.user = user.id;

  if (!input.shippingAddress) {
    if (!user.address)
      return res.status(422).send("Shipping address is required.");

    input.shippingAddress = user.address;
  }

  try {
    const order = await orderService.createOrder(input);

    res.json(order);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  const id = req.params.id;
  const input = req.body;

  try {
    await orderService.getOrderById(id);

    if (!input.status) return res.status(422).send("Order status is required.");

    const order = await orderService.updateOrderStatus(id, input.status);

    res.json(order);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;

  try {
    await orderService.getOrderById(id);

    await orderService.deleteOrder(id);

    res.send("Order deleted successfully.");
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

const checkoutOrder = async (req, res) => {
  const id = req.params.id;
  const input = req.body;

  try {
    console.log("➡️ Checking out order:", { id, input });
    const order = await orderService.checkoutOrder(id, input);

    res.json(order);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

const confirmOrder = async (req, res) => {
  const id = req.params.id;
  const input = req.body;

  try {
    if (!input.status)
      return res.status(422).send("Order confirm status is required");

    const order = await orderService.confirmOrder(id, input);

    res.json(order);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

export {
  getAllOrders,
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  checkoutOrder,
  confirmOrder,
  getOrderSummary,
};
