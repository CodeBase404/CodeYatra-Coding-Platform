import React, { useState } from "react";
import { AlertTriangle, Trash2, Shield, X } from "lucide-react";

const DeleteMyAccount = ({ onDeleteAccount, onLogout, onNavigate }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationText.toLowerCase() !== "delete my account") {
      return;
    }

    setIsDeleting(true);

    try {
      await onDeleteAccount();
      onLogout();
      onNavigate("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationText("");
    setIsDeleting(false);
  };

  if (showConfirmation) {
    return (
      <div className="mt-10 border-t border-red-200 pt-8">
        <div className="bg-red-50 dark:bg-white/5 border border-red-200 dark:border-white/10 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-700 mb-4">
                Confirm Account Deletion
              </h2>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-red-500 font-medium">
                  ⚠️ This action is permanent and cannot be undone!
                </p>

                <div className="bg-white dark:bg-white/5 border border-red-200 dark:border-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-red-500 mb-2">
                    What will be deleted:
                  </h3>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Your profile and personal information</li>
                    <li>• All your submissions and content</li>
                    <li>• Your preferences and settings</li>
                    <li>• Your account history and activity</li>
                    <li>• Any premium features or subscriptions</li>
                  </ul>
                </div>

                <p className="text-sm text-red-700">
                  To confirm deletion, please type{" "}
                  <code className="bg-red-100 px-2 py-1 rounded font-mono text-xs">
                    delete my account
                  </code>{" "}
                  in the field below:
                </p>

                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type 'delete my account' to confirm"
                  className="w-full px-4 py-3 border border-red-300 dark:border-white/10  rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  disabled={isDeleting}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={
                    confirmationText.toLowerCase() !== "delete my account" ||
                    isDeleting
                  }
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete My Account Forever
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-red-200 pt-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Shield className="w-6 h-6 text-red-600 mt-1" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
              Account deletion is a permanent action that cannot be reversed.
              Once you delete your account, all associated data will be
              immediately and permanently removed from our servers.
            </p>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
              Before proceeding, please consider downloading any important data
              or content you wish to keep. You may also want to cancel any
              active subscriptions to avoid future charges.
            </p>

            <div className="bg-amber-50   border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">
                    Consider these alternatives:
                  </h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Temporarily disable your account instead</li>
                    <li>
                      • Update your privacy settings to limit data sharing
                    </li>
                    <li>
                      • Contact support if you're having issues with the service
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you're experiencing issues with your account or have concerns
              about privacy, our support team is here to help. Deletion should
              be your last resort.
            </p>
          </div>

          <button
            onClick={handleDeleteClick}
            className="group btn btn-error text-white px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
            aria-label="Delete your account permanently"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMyAccount