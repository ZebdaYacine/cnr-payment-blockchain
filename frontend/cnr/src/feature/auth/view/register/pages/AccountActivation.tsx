import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../../../core/state/AuthContext";
import { useUser } from "../../../../../core/state/UserContext";

function AccountActivation() {
  const navigate = useNavigate();
  const { isAuthentificated } = useAuth();
  const { userSaved } = useUser();

  useEffect(() => {
    if (!isAuthentificated) {
      navigate("/");
    }
  }, [isAuthentificated]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Account Pending Activation
          </h2>
          <p className="text-gray-600">
            Welcome {userSaved?.first_name}! Your account has been created
            successfully.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Check your email for activation instructions
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Follow the link in the email to activate your account
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Once activated, you can access all features
              </li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AccountActivation;
