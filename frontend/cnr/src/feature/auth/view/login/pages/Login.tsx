import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
import { FormEvent, useEffect, useRef } from "react";
import { useUserId } from "../../../../../core/state/UserContext";
import UserNameInput from "../../../../../core/components/UserNameInput";
import PasswordInput from "../../../../../core/components/PassWordInput";
import { useTheme } from "../../../../../core/state/ThemeContext";
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
  const { login, isPending, isSuccess } = useAuthViewModel(loginUseCase);
  const navigate = useNavigate();
  const { toggleLightMode } = useTheme();

  const {
    username: userName,
    SetUsername: SetUserName,
    password: password,
    SetPassWord: SetPassWord,
  } = useUserId();

  const { isAuthentificated } = useAuth();

  const loginEvent = async (event: FormEvent) => {
    event.preventDefault();
    login({ username: userName, password: password });
    if (isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
      if (isSuccess) {
        if (isAuthentificated) {
          navigate("/home");
        }
      }
    }
  };

  useEffect(() => {
    toggleLightMode();
  });

  const ref = useRef<LoadingBarRef>(null);

  return (
    <>
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div className="flex flex-col items-center bg-slate-200 justify-center min-h-screen">
        <form className="space-y-4 p-5 m-10  bg-slate-50 rounded shadow-md w-full max-w-screen-md">
          <AvatarCnr />
          <UserNameInput
            value={userName}
            onChange={(e) => SetUserName(e.target.value)}
          />
          <PasswordInput onChange={(e) => SetPassWord(e.target.value)} />
          <div className="flex justify-center">
            <LoginButton loginEvent={loginEvent} />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default LoginPage;
