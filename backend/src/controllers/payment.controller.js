const Razorpay = require("razorpay");
const Payment = require("../models/payment.model");
const crypto = require("crypto");
const User = require("../models/user.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId },
    };

    const order = await razorpay.orders.create(options);

    // Save pending payment
    await Payment.create({
      userId,
      orderId: order.id,
      amount,
      status: "created",
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment order creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const userId = req.user._id; // ✅ From auth middleware

  // Construct body for verification
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  // Generate expected signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // ✅ Signature matched → mark as success
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        status: "captured",
      }
    );

    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await User.findByIdAndUpdate(userId, {
      $set: {
        premiumPlan: {
          type: "monthly",
          isActive: true,
          isUsed: true,
          startDate: now,
          endDate: end,
        },
      },
      $push: {
        paymentHistory: {
          razorpay_order_id,
          razorpay_payment_id,
          amount: updatedPayment.amount,
          status: "captured",
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and premium unlocked!",
    });
  }

  // ❌ Signature mismatch → reject
  res.status(400).json({
    success: false,
    message: "Invalid signature. Payment verification failed.",
  });
};

module.exports = { createOrder, verifyPayment };
