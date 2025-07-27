import { useEffect, useState } from "react";
import { Check, Star, Zap, Shield, Users, Headphones } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { fetchUserProfile } from "../features/auth/authThunks";

function PlanPage() {
  const [loading, setLoading] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isPremiumActive =
    user?.premiumPlan?.isActive &&
    dayjs().isBefore(dayjs(user?.premiumPlan?.endDate));

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Failed to load Razorpay SDK. Try again.");
        return;
      }

      const { data } = await axiosClient.post("/payment/order", {
        amount: 499,
      });

      console.log("Razorpay Order Response:", data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "CodeYatra Premium",
        description: "Monthly Subscription",
        handler: async function (response) {
          console.log("Razorpay Response:", response);
          try {
            const verifyData = await axiosClient.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("Verification Response:", verifyData);

            if (verifyData.data.success) {
              toast.success("🎉 Payment successful!");
              dispatch(fetchUserProfile());
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: user.firstName,
          email: user?.emailId,
        },
        theme: {
          color: "#3399cc",
        },
      };

      console.log("options", options);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(
        err?.response?.data?.error || "Something went wrong during payment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.premiumPlan?.isActive) {
      const now = dayjs();
      const end = dayjs(user.premiumPlan.endDate);
      const diffInMinutes = end.diff(now, "minute");

      if (diffInMinutes <= 0) {
        setDaysLeft("Expired");
      } else if (diffInMinutes < 60) {
        setDaysLeft(`${diffInMinutes} minute(s) left`);
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        const mins = diffInMinutes % 60;
        setDaysLeft(`${hours} hour(s) ${mins} minute(s) left`);
      } else {
        const days = end.diff(now, "day");
        setDaysLeft(`${days} day(s) left`);
      }
    } else {
      setDaysLeft("Expired");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-black/50 via-blue-50 dark:via-neutral/50 to-indigo-100 dark:to-black/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
              Start free and upgrade anytime. No hidden fees, no commitments.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div
              className={`relative bg-white dark:bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free</h3>
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-600">
                      Starter
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">₹0</span>
                  </div>
                  <p className="text-gray-600 dark:text-white/80 mt-2">
                    Perfect for getting started
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">Up to 5 projects</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">Basic templates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">Community support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">
                      Standard export options
                    </span>
                  </li>
                </ul>

                {!isPremiumActive && (
                  <button className="btn btn-soft w-full opacity-50 btn-ghost rounded-xl h-12">
                    your current plan
                  </button>
                )}
              </div>
            </div>

            {/* Premium Plan */}
            <div
              className={`relative bg-white dark:bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">Most Popular</span>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium</h3>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-white">Pro</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ₹499
                    </span>
                    <span className="text-xl text-gray-500 dark:text-white/80 ml-2">/month</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Save 17%
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">Unlimited projects</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">
                      Premium templates & components
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">
                      Advanced security features
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-white/50">
                      Team collaboration tools
                    </span>
                  </li>
                </ul>

                {loading ? (
                  <button className="btn w-full h-12 opacity-50" disabled>
                    Processing...
                  </button>
                ) : !isPremiumActive ? (
                  <button
                    onClick={handlePayment}
                    className="btn btn-soft btn-primary btn-gradient w-full h-12 rounded"
                  >
                    Buy Premium
                  </button>
                ) : (
                  <div className="btn btn-soft w-full cursor-default opacity-50 btn-ghost h-12">
                    your current plan
                  </div>
                )}
                {isPremiumActive && daysLeft && daysLeft !== "Expired" && (
                  <p className="text-sm text-gray-500 dark:text-white text-center mt-2">
                    Your plan expires on{" "}
                    {dayjs(user.premiumPlan.endDate).format(
                      "MMM D, YYYY h:mm A"
                    )}{" "}
                   <span className="text-red-500 font-medium text-sm">{daysLeft}</span>
                  </p>
                )}

                {isPremiumActive && daysLeft === "Expired" && (
                  <p className="text-sm text-red-500 text-center mt-2">
                    Your premium plan has expired.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanPage;
