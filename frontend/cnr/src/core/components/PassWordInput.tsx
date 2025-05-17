import { useState, useEffect } from "react";
import { FaKey } from "react-icons/fa6";

interface PasswordInputProps {
  hidden?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: boolean; // <-- Pour activer la validation depuis le parent
  value: string;
}

function PasswordInput({
  hidden = false,
  onChange,
  validate = false,
  value,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (validate) {
      setHasError(value.trim().length === 0);
    }
  }, [validate, value]);

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
            placeholder="Mot de passe"
          />
        </label>
        {hasError && (
          <span className="text-error text-sm mt-1">
            Le mot de passe est requis.
          </span>
        )}
      </div>

      <div className="flex flex-row justify-between items-start items-center mt-2 gap-1 text-sm md:text-base">
        <label className="label cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="checkbox checkbox-primary"
          />
          <span className="md:text-xl label-text">
            Afficher le mot de passe
          </span>
        </label>

        {!hidden && (
          <a
            href="#"
            className="md:text-xl text-blue-500 hover:text-blue-700 underline"
          >
            Mot de passe oublié ?
          </a>
        )}
      </div>
    </>
  );
}

export default PasswordInput;
