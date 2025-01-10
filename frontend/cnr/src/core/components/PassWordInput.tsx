import { useState } from "react";
import { FaKey } from "react-icons/fa6";
function PasswordInput({ hidden = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="form-control">
        <label className="input input-bordered flex items-center gap-2">
          <FaKey />
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
