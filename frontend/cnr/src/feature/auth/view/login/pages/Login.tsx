import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
import { FormEvent, useEffect, useRef, useState } from "react";
import EmailInput from "../../../../../core/components/EmailInput";
import PasswordInput from "../../../../../core/components/PassWordInput";
import { AuthDataSourceImpl } from "../../../data/dataSource/AuthAPIDataSource";
import { AuthRepositoryImpl } from "../../../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../../../domain/UseCases/AuthUseCase";
import { useAuthViewModel } from "../../../viewmodel/AuthViewModel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useAuth } from "../../../../../core/state/AuthContext";

const dataSource = new AuthDataSourceImpl();
const repository = new AuthRepositoryImpl(dataSource);
const loginUseCase = new LoginUseCase(repository);

function LoginPage() {
  const { login, isPending, isSuccess, isError } =
    useAuthViewModel(loginUseCase);
  const navigate = useNavigate();
  const { isAuthentificated } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }

    if (isSuccess && isAuthentificated) {
      navigate("/home/welcome");
    }
  }, [isPending, isSuccess, isError, isAuthentificated]);

  const loginEvent = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!password.trim()) return;

    await login({ username: email, password });
  };

  return (
    <>
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div className="flex flex-col items-center bg-slate-200 justify-center min-h-screen">
        <form
          className="space-y-4 p-5 m-10 bg-slate-50 rounded shadow-md w-full max-w-screen-md"
          onSubmit={loginEvent}
        >
          <AvatarCnr />
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            validate={isSubmitted}
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            validate={isSubmitted}
          />
          <div className="flex justify-center">
            <LoginButton loginEvent={loginEvent} name="Se connecter" />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default LoginPage;
