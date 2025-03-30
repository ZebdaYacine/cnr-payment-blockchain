import React, { useState, useRef, useEffect } from "react";
import { FaHourglassHalf } from "react-icons/fa";
import { useTimer } from "../state/TimerContext";
import { useKeys } from "../state/PublicKeyContext";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { useNavigate } from "react-router";
import { useOTP } from "../state/OTPContext";
import { ToastContainer } from "react-toastify";

const OtpInput: React.FC<{ length?: number; onResend?: () => void }> = ({
  length = 6,
  onResend,
}) => {
  const { timeLeft, startTimer, hasStarted } = useTimer();
  const { publicKey } = useKeys();
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [disabled, setDisabled] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const { isOTPConfirmed } = useOTP();

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { ConfirmOTP, isConfirmingOTP, isOTPConfirmedError } =
    useProfileViewModel(profileUseCase);

  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    setDisabled(timeLeft === 0);
  }, [timeLeft]);

  useEffect(() => {
    if (!hasStarted) startTimer();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length).split("");
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      if (/^[0-9]$/.test(pasted[i])) {
        newOtp[i] = pasted[i];
      }
    }
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  const handleResend = () => {
    setOtp(Array(length).fill(""));
    setValidated(false);
    startTimer();
    onResend?.();
  };

  const handleValidate = () => {
    if (isOtpComplete) {
      setValidated(true);
      ConfirmOTP({ otp: otp.join("") });
      startTimer();
    }
  };

  useEffect(() => {
    if (isOTPConfirmed) {
      navigate("/home/PK-manager/add-public-key");
    } else if (isOTPConfirmedError) {
      navigate("/home/error-page");
    }
  }, [isOTPConfirmed, isOTPConfirmedError]);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Enter OTP</h1>

        <div className="text-sm text-gray-400">{publicKey}</div>

        <div className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="input input-bordered w-12 text-center text-xl"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputsRef.current[index] = el)}
              disabled={disabled || isConfirmingOTP}
            />
          ))}
        </div>

        {timeLeft > 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaHourglassHalf className="text-yellow-500 animate-pulse" />
            <span>Resend code in {timeLeft}s</span>
          </div>
        ) : (
          validated && (
            <button
              className="btn btn-link text-primary"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )
        )}

        {/* Validation Button */}
        {isOtpComplete && (
          <button
            className="btn btn-primary mt-2"
            onClick={handleValidate}
            disabled={isConfirmingOTP}
          >
            {isConfirmingOTP ? "Vérification..." : "Validate OTP"}
          </button>
        )}
      </div>
    </>
  );
};

export default OtpInput;
