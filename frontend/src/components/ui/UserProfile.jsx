import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Shield,
  Calendar,
  Edit3,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  ShieldAlert,
} from "lucide-react";
import Modal from "./Modal";
import ProfileUpload from "./ProfileUpload";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";
import { deleteAccount, fetchUserProfile, logoutUser } from "../../features/auth/authThunks";
import AccountVerification from "./AccountVerification";
import { setShowCreateModal } from "../../features/ui/uiSlice";
import DeleteMyAccount from "./DeleteMyAccount";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showCreateModal } = useSelector((state) => state.ui);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      role: user?.role,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const onProfileSubmit = async (data) => {
    try {
      const res = await axiosClient.put("/user/update-profile", {
        firstName: data.firstName,
      });
      dispatch(fetchUserProfile());
      alert(res.data.message || "Profile updated successfully");
      setIsEditing(false);
      resetProfile(data);
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const response = await axiosClient.post("/user/update-password", {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      alert(response.data.message || "Password updated successfully");
      setIsChangingPassword(false);
      resetPassword();
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      alert(msg);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile();
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 dark:from-neutral to-indigo-100 dark:to-neutral p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 dark:from-gray-900 to-indigo-600 dark:to-gray-900 px-8 py-6">
          <div className="flex items-center space-x-4">
            <ProfileUpload profilePic={user?.profileImage?.secureUrl} />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.firstName}
              </h1>
              <p className="text-blue-100 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user?.role}</span>
                {user?.isAccountVerified ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => dispatch(setShowCreateModal(true))}
                    className="btn btn-error h-8 animate-pulse text-white px-2 py-1 rounded-full text-xs font-medium"
                  >
                    <ShieldAlert className="h-5 w-5" /> Pending Verification
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-neutral">
          {/* Profile Information Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      {...registerProfile("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your first name"
                    />
                    {profileErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {profileErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  {user?.role === "admin" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        {...registerProfile("role", {
                          required: "Role is required",
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                      {profileErrors.role && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileErrors.role.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    First Name
                  </label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {user?.firstName}
                  </p>
                </div>
                {user?.role === "admin" && (
                  <div className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Role
                    </label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                      {user?.role}
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-white/5 border border-white/10 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {user?.emailId || user?.email}
                    </p>
                    <span className="text-xs text-gray-500">(Immutable)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50  dark:bg-white/5 border border-white/10  p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Account Created
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50  dark:bg-white/5 border border-white/10  p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formatDate(user?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Password & Security
              </h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 btn btn-dash btn-error text-white rounded-lg transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6 w-[50%] mx-auto"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword("currentPassword", {
                          required: "Current password is required",
                        })}
                        type={showCurrentPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message:
                              "Password must contain at least one uppercase, lowercase, number, and special character",
                          },
                        })}
                        type={showNewPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your new password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50  dark:bg-white/5 border border-white/10  p-4 rounded-lg">
                <p className="text-gray-600 dark:text-white/80">
                  Your password is securely encrypted. Click "Change Password"
                  to update your password.
                </p>
              </div>
            )}
          </div>
          <DeleteMyAccount
            onDeleteAccount={() => dispatch(deleteAccount())}
            onLogout={() => dispatch(logoutUser())}
            onNavigate={navigate}
          />
        </div>
      </div>
      <Modal
        isOpen={!!showCreateModal}
        onClose={() => dispatch(setShowCreateModal(false))}
        title="Account Verification"
        size="xl"
      >
        {showCreateModal && (
          <AccountVerification
            userEmail={user?.email || user?.emailId}
            verificationOtpSend={true}
            onVerificationSuccess={() => {
              dispatch(setShowCreateModal(false));
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Profile;
