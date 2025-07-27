import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Shield, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../features/auth/authThunks";

const AccountVerification = ({
  userEmail,
  verificationOtpSend,
  onVerificationSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const otpValues = watch("otp");

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendOtp = async () => {
    if (!canResend) return;
    setIsSending(true);
    try {
      const res = await axiosClient.get("/user/sent-verify-otp");
      console.log(res);

      setCanResend(false);
      setResendTimer(60);
    } catch (error) {
      console.error("Failed to send OTP:", error.response?.data?.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setValue("otp", newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = Array(6).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setValue("otp", newOtp);
    setTimeout(() => {
      inputRefs.current[pastedData.length - 1]?.focus();
    }, 0);
  };

  const onSubmit = async (data) => {
    const otpString = data.otp.join("");
    if (otpString.length !== 6) return;

    setIsLoading(true);
    try {
      await axiosClient.post("/user/verify-account", { otp: otpString });
      setIsVerified(true);
      dispatch(fetchUserProfile);
      setTimeout(() => {
        onVerificationSuccess?.();
      }, 1000);
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      console.error(message);
      reset();
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (verificationOtpSend) {
      sendOtp();
    }
  }, [verificationOtpSend]);

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Account Verified Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your email has been verified. You now have full access to your
            account.
          </p>
          <div className="w-full bg-green-500 h-1 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Account
          </h1>
          <p className="text-gray-600">We've sent a verification code to</p>
          <p className="text-blue-600 font-medium">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter 6-digit verification code
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otpValues.map((digit, index) => (
                <Controller
                  key={index}
                  name={`otp.${index}`}
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^\d$/,
                      message: "Only digits allowed",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                        field.ref(el);
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                        handleOtpChange(index, value);
                      }}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      disabled={isLoading}
                    />
                  )}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Please enter all 6 digits
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otpValues.join("").length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify Account
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
          <button
            type="button"
            onClick={sendOtp}
            disabled={!canResend || isSending}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : !canResend ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend in {resendTimer}s
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            Check your spam folder if you don't see the email. The code expires
            in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountVerification;
