import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaHourglassHalf } from "react-icons/fa";
import { useTimer } from "../state/TimerContext";
import { useKeys } from "../state/KeyContext";
import { PofileUseCase } from "../../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileDataSourceImpl } from "../../feature/profile/data/dataSource/ProfileAPIDataSource";
import { ProfileRepositoryImpl } from "../../feature/profile/data/repository/ProfileRepositoryImpl";
import { useProfileViewModel } from "../../feature/profile/viewmodel/ProfileViewModel";
import { useNavigate } from "react-router";
import { useOTP } from "../state/OTPContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../state/UserContext";

const OtpInput: React.FC<{ length?: number }> = ({ length = 6 }) => {
  const { timeLeft, startTimer, hasStarted } = useTimer();
  const { publicKey } = useKeys();
  const { userSaved } = useUser();
  const { isOTPConfirmed, setOTPSent } = useOTP();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );

  const {
    ConfirmOTP,
    isConfirmingOTP,
    isOTPConfirmedError,
    sendOTP,
    isOTPSentSuccess,
  } = useProfileViewModel(profileUseCase);

  const isOtpComplete = otp.every((digit) => digit !== "");
  const disabled = timeLeft === 0;

  useEffect(() => {
    if (!hasStarted) startTimer();
  }, [hasStarted, startTimer]);

  useEffect(() => {
    if (isOTPSentSuccess) {
      setOTPSent(true);
    }
  }, [isOTPSentSuccess, setOTPSent]);

  const handleChange = useCallback(
    (value: string, index: number) => {
      if (!/^[0-9]?$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [otp, length]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && otp[index] === "") {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
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
    },
    [otp, length]
  );

  const handleResend = useCallback(() => {
    setOtp(Array(length).fill(""));
    sendOTP({ email: userSaved.email });
    startTimer();
  }, [length, sendOTP, userSaved.email, startTimer]);

  const handleValidate = useCallback(() => {
    if (isOtpComplete) {
      ConfirmOTP({ otp: otp.join("") });
    }
  }, [isOtpComplete, otp, ConfirmOTP]);

  useEffect(() => {
    if (isOTPConfirmed) {
      navigate(
        userSaved.publicKey
          ? "/home/PK-manager/add-private-key"
          : "/home/PK-manager/add-public-key"
      );
    } else if (isOTPConfirmedError) {
      navigate("/home/error-page");
    }
  }, [isOTPConfirmed, isOTPConfirmedError, userSaved.publicKey, navigate]);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Entrer le code OTP</h1>

        <div className="text-sm text-gray-400 break-all">{publicKey}</div>

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
              disabled={disabled}
            />
          ))}
        </div>

        {timeLeft > 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaHourglassHalf className="text-yellow-500 animate-pulse" />
            <span>Envoyer le code dans {timeLeft}s</span>
          </div>
        ) : (
          <button
            className="btn btn-link text-primary"
            onClick={handleResend}
            disabled={isConfirmingOTP}
          >
            Renvoyer le code
          </button>
        )}

        {isOtpComplete && (
          <button
            className="btn btn-primary mt-2"
            onClick={handleValidate}
            disabled={isConfirmingOTP}
          >
            {isConfirmingOTP ? "Vérification..." : "Valider OTP"}
          </button>
        )}
      </div>
    </>
  );
};

export default OtpInput;
