const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth.middleware");
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const paymentRouter = express.Router();

paymentRouter.post("/order", userAuthMiddleware, createOrder);
paymentRouter.post("/verify", userAuthMiddleware, verifyPayment);

module.exports = paymentRouter;
