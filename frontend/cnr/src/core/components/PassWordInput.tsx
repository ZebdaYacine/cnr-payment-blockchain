import { useState, useEffect } from "react";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router";

interface PasswordInputProps {
  hidden?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: boolean;
  value: string;
  label?: string;
  placeholder?: string;
  showForgotPassword?: boolean;
}

function PasswordInput({
  hidden = false,
  onChange,
  validate = false,
  value,
  label = "Mot de passe",
  placeholder = "Mot de passe",
  showForgotPassword = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (validate) {
      setHasError(value.trim().length === 0);
    }
  }, [validate, value]);
  const navigate = useNavigate();

  return (
    <>
      <div className="form-control w-full">
        <label
          className={`input input-bordered flex items-center gap-2 ${
            hasError ? "input-error" : ""
          }`}
        >
          <FaKey />
          <input
            onChange={onChange}
            value={value}
            type={showPassword ? "text" : "password"}
            className="grow p-2 focus:outline-none text-sm md:text-base"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className=" hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </label>
        {hasError && (
          <span className="text-error text-sm mt-1">{label} est requis.</span>
        )}
      </div>

      <div className="flex flex-row justify-end items-start items-center mt-2 gap-1 text-sm md:text-base">
        {showForgotPassword && !hidden && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/forgot-password");
            }}
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Mot de passe oublié ?
          </button>
        )}
      </div>
    </>
  );
}

export default PasswordInput;
