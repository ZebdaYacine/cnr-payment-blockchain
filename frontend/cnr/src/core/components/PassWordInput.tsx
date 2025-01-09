import { useState } from "react";

function PasswordInput({ hidden = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="form-control">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            className="grow p-2 focus:outline-none"
            placeholder="Enter your password"
          />
        </label>
      </div>
      <div className="flex justify-between items-center mt-2">
        <label className="label cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="checkbox checkbox-primary"
          />
          <span className="label-text text-xl">Show Password</span>
        </label>
        <a
          hidden={hidden}
          href="#"
          className="text-xl text-blue-500 hover:text-blue-700"
        >
          Forgot Password?
        </a>
      </div>
    </>
  );
}

export default PasswordInput;
