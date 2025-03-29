import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
import { FormEvent, useEffect, useRef, useState } from "react";
import UserNameInput from "../../../../../core/components/UserNameInput";
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
  const { login, isPending, isError, isSuccess } =
    useAuthViewModel(loginUseCase);
  const navigate = useNavigate();

  const { isAuthentificated } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const ref = useRef<LoadingBarRef>(null);

  useEffect(() => {
    if (isPending) {
      ref.current?.continuousStart();
    } else if (isSuccess && isAuthentificated) {
      ref.current?.complete();
      navigate("/home/welcome");
    } else if (isError) {
      ref.current?.complete();
    }
  }, [isPending, isError, isSuccess, isAuthentificated]);

  const loginEvent = async (event: FormEvent) => {
    event.preventDefault();
    ref.current?.continuousStart();
    await login({ username, password });
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
          <UserNameInput
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-center">
            <LoginButton loginEvent={loginEvent} name="Login" />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default LoginPage;
