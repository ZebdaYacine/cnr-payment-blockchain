import { useEffect, useState } from "react";
import { BsPersonFill } from "react-icons/bs";

interface EmailInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: boolean;
}

function EmailInput({ value, onChange, validate = false }: EmailInputProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (validate) {
      setHasError(
        value.trim().length === 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      );
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
          <BsPersonFill className="h-5 w-5" />
          <input
            value={value}
            onChange={onChange}
            name="email"
            autoComplete="email"
            type="email"
            className="grow focus:outline-none text-sm md:text-base"
            placeholder="Adresse e-mail"
          />
        </label>
        {hasError && (
          <span className="text-error text-sm mt-1">
            Veuillez saisir une adresse e-mail valide.
          </span>
        )}
      </div>
    </>
  );
}

export default EmailInput;
