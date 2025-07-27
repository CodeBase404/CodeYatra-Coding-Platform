import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  ArrowRight,
  Check,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearError, clearOtpSent } from "../features/auth/authSlice";
import {
  resetPassOtpVerify,
  resetPassWord,
  resetPasswordOtp,
} from "../features/auth/authThunks";
import { setShowPassword } from "../features/ui/uiSlice";

function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState("email");
  const [userEmail, setUserEmail] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const showPassword = useSelector((state) => state.ui.showPassword);
  const { otpSent, otpMessage, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailForm = useForm();
  const otpForm = useForm();
  const passwordForm = useForm();

  const onEmailSubmit = async (data) => {
    setUserEmail(data.email);
    try {
      await dispatch(resetPasswordOtp(data.email)).unwrap();
      setCurrentStep("otp");
    } catch (err) {
      toast.error(err || "OTP request failed");
      console.error("OTP request failed:", err);
    }
  };

  const onOTPSubmit = async (data) => {
    const otp = data.otp;

    try {
      await dispatch(resetPassOtpVerify({ emailId: userEmail, otp })).unwrap();

      toast.success("OTP Verified");
      setCurrentStep("password");
    } catch (err) {
      console.error("OTP Verify Error:", err);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await dispatch(
        resetPassWord({ emailId: userEmail, newPassword: data.password })
      ).unwrap();
      toast.success("Password reset successful");
      setCurrentStep("success");
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "email", label: "Email", icon: Mail },
      { key: "otp", label: "Verify", icon: Check },
      { key: "password", label: "Password", icon: Lock },
    ];

    const getStepIndex = (step) => {
      switch (step) {
        case "email":
          return 0;
        case "otp":
          return 1;
        case "password":
          return 2;
        case "success":
          return 3;
      }
    };

    const currentIndex = getStepIndex(currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                  isCompleted
                    ? "text-green-600"
                    : isActive
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-4 transition-colors duration-300 ${
                    index < currentIndex ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEmailForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-gray-600">
          Enter your email address to receive a verification code
        </p>
      </div>

      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              {...emailForm.register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>
          {emailForm.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center group"
        >
          Send Verification Code
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <NavLink
          to="/login"
          className="flex items-center justify-center text-gray-400 w-[40%] mx-auto hover:text-blue-400 font-medium"
        >
          <ChevronLeft size={20} className="pt-0.5" />
          Back to Login
        </NavLink>
      </form>
    </div>
  );

  const renderOTPForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to{" "}
          <span className="font-semibold text-blue-600">{userEmail}</span>
        </p>
      </div>

      <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="otp"
            maxLength={6}
            {...otpForm.register("otp", {
              required: "Please enter the verification code",
              pattern: {
                value: /^\d{6}$/,
                message: "Please enter a valid 6-digit code",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-2xl font-mono tracking-widest"
            placeholder="000000"
          />
          {otpForm.formState.errors.otp && (
            <p className="mt-1 text-sm text-red-600">
              {otpForm.formState.errors.otp.message}
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setCurrentStep("email")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center group"
          >
            Verify Code
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderPasswordForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Password
        </h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      <form
        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...passwordForm.register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => dispatch(setShowPassword(!showPassword))}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordForm.formState.errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {passwordForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...passwordForm.register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => {
                  const password = passwordForm.getValues("password");
                  return value === password || "Passwords do not match";
                },
              })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordForm.formState.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {passwordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setCurrentStep("otp")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center group"
          >
            Reset Password
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderSuccessForm = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Password Reset Successful!
        </h2>
        <p className="text-gray-600">
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>
      </div>
      <button
        onClick={() => {
          setCurrentStep("email");
          emailForm.reset();
          otpForm.reset();
          passwordForm.reset();
          navigate("/login");
        }}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
      >
        Continue to Login
      </button>
    </div>
  );

  useEffect(() => {
    if (otpSent && currentStep === "email") {
      toast.success(otpMessage || "OTP sent successfully!");
      dispatch(clearOtpSent());
    }
  }, [otpSent, otpMessage, dispatch]);

  useEffect(() => {
    if (error && currentStep !== "email") {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, currentStep, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep !== "success" && renderStepIndicator()}

          <div className="transition-all duration-300">
            {currentStep === "email" && renderEmailForm()}
            {currentStep === "otp" && renderOTPForm()}
            {currentStep === "password" && renderPasswordForm()}
            {currentStep === "success" && renderSuccessForm()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
